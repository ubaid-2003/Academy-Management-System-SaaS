'use strict';

const {
  FeeStructure,
  FeePayment,
  Student,
  StudentFeeStructure,
  Class,
  Course,
  CourseFeeStructure, // ✅ singular
  sequelize
} = require('../models');

const FeeController = {

  // ========================= CREATE FEE STRUCTURE =========================
  createFeeStructure: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      let {
        academyId,
        classId,
        tuitionFee,
        admissionFee,
        examFee,
        libraryFee,
        sportsFee,
        otherFee,
        dueDate,
        academicYear,
        isActive,
        courseIds // optional array
      } = req.body;

      if (!academyId || !classId || !dueDate || !academicYear) {
        return res.status(400).json({
          success: false,
          message: "academyId, classId, dueDate, and academicYear are required"
        });
      }

      tuitionFee = Number(tuitionFee) || 0;
      admissionFee = Number(admissionFee) || 0;
      examFee = Number(examFee) || 0;
      libraryFee = Number(libraryFee) || 0;
      sportsFee = Number(sportsFee) || 0;
      otherFee = Number(otherFee) || 0;

      // Create FeeStructure
      const feeStructure = await FeeStructure.create({
        academyId,
        classId,
        tuitionFee,
        admissionFee,
        examFee,
        libraryFee,
        sportsFee,
        otherFee,
        dueDate,
        academicYear,
        isActive: isActive !== undefined ? isActive : true
      }, { transaction: t });

      // Link Courses
      if (Array.isArray(courseIds) && courseIds.length > 0) {
        const courseLinks = courseIds.map(courseId => ({
          courseId,
          feeStructureId: feeStructure.id
        }));
        await CourseFeeStructure.bulkCreate(courseLinks, { transaction: t });
      }

      // Assign all students in class
      const students = await Student.findAll({ where: { classId } });
      if (students.length > 0) {
        const studentFeeRecords = students.map(student => ({
          studentId: student.id,
          feeStructureId: feeStructure.id,
          discount: 0,
          scholarship: 0,
          finalAmount: tuitionFee + admissionFee + examFee + libraryFee + sportsFee + otherFee,
          status: 'active'
        }));
        await StudentFeeStructure.bulkCreate(studentFeeRecords, { transaction: t });
      }

      await t.commit();
      return res.status(201).json({ success: true, message: "Fee structure created successfully", data: feeStructure });

    } catch (err) {
      await t.rollback();
      console.error("createFeeStructure error:", err);
      return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  },

  // ========================= ASSIGN STUDENTS TO FEE STRUCTURE =========================
  assignStudentsToFeeStructure: async (req, res) => {
    try {
      const { feeStructureId } = req.params;
      const { studentIds } = req.body;

      if (!Array.isArray(studentIds) || studentIds.length === 0) {
        return res.status(400).json({ success: false, message: "studentIds array is required" });
      }

      const studentFeeRecords = studentIds.map(studentId => ({
        studentId,
        feeStructureId,
        finalAmount: 0,
        status: 'active'
      }));

      await StudentFeeStructure.bulkCreate(studentFeeRecords, { ignoreDuplicates: true });

      return res.status(200).json({ success: true, message: "Students assigned successfully" });

    } catch (err) {
      console.error("assignStudentsToFeeStructure error:", err);
      return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  },

  // ========================= GET ALL FEE STRUCTURES =========================
  getFeeStructures: async (req, res) => {
    try {
      const { academyId } = req.params;

      const feeStructures = await FeeStructure.findAll({
        where: { academyId },
        include: [
          {
            model: CourseFeeStructure,
            as: 'courseFeeStructures', // must match model association alias
            include: [{ model: require('../models').Course, as: 'course' }]
          },
          { model: Class, as: 'class', attributes: ['id', 'name'] }
        ]
      });

      return res.status(200).json({ success: true, data: feeStructures });

    } catch (err) {
      console.error("getFeeStructures error:", err);
      return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  },

  // ========================= GET SINGLE FEE STRUCTURE =========================
  getFeeStructureById: async (req, res) => {
    try {
      const { id } = req.params;

      const feeStructure = await FeeStructure.findByPk(id, {
        include: [
          // Include the class details
          { model: Class, as: 'class', attributes: ['id', 'name'] },

          // Include all associated courses via CourseFeeStructure
          {
            model: CourseFeeStructure,
            as: 'courseFeeStructures',
            include: [
              {
                model: Course,
                as: 'course',
                attributes: ['id', 'title', 'code', 'field', 'credits']
              }
            ]
          }
        ]
      });

      if (!feeStructure) {
        return res.status(404).json({ success: false, message: "Fee structure not found" });
      }

      return res.status(200).json({ success: true, data: feeStructure });

    } catch (err) {
      console.error("getFeeStructureById error:", err);
      return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  },


  // ========================= UPDATE FEE STRUCTURE =========================
  updateFeeStructure: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const {
        tuitionFee,
        admissionFee,
        examFee,
        libraryFee,
        sportsFee,
        otherFee,
        dueDate,
        academicYear,
        isActive,
        courseIds
      } = req.body;

      const feeStructure = await FeeStructure.findByPk(id);
      if (!feeStructure) return res.status(404).json({ success: false, message: "Fee structure not found" });

      await feeStructure.update({
        tuitionFee: tuitionFee !== undefined ? tuitionFee : feeStructure.tuitionFee,
        admissionFee: admissionFee !== undefined ? admissionFee : feeStructure.admissionFee,
        examFee: examFee !== undefined ? examFee : feeStructure.examFee,
        libraryFee: libraryFee !== undefined ? libraryFee : feeStructure.libraryFee,
        sportsFee: sportsFee !== undefined ? sportsFee : feeStructure.sportsFee,
        otherFee: otherFee !== undefined ? otherFee : feeStructure.otherFee,
        dueDate: dueDate || feeStructure.dueDate,
        academicYear: academicYear || feeStructure.academicYear,
        isActive: isActive !== undefined ? isActive : feeStructure.isActive
      }, { transaction: t });

      if (Array.isArray(courseIds)) {
        await CourseFeeStructure.destroy({ where: { feeStructureId: id }, transaction: t });
        const courseLinks = courseIds.map(courseId => ({ courseId, feeStructureId: id }));
        await CourseFeeStructure.bulkCreate(courseLinks, { transaction: t });
      }

      await t.commit();
      return res.status(200).json({ success: true, message: "Fee structure updated", data: feeStructure });

    } catch (err) {
      await t.rollback();
      console.error("updateFeeStructure error:", err);
      return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  },

  // ========================= DELETE FEE STRUCTURE =========================
  deleteFeeStructure: async (req, res) => {
    try {
      const { id } = req.params;
      const feeStructure = await FeeStructure.findByPk(id);
      if (!feeStructure) return res.status(404).json({ success: false, message: "Fee structure not found" });

      await CourseFeeStructure.destroy({ where: { feeStructureId: id } });
      await StudentFeeStructure.destroy({ where: { feeStructureId: id } });
      await feeStructure.destroy();

      return res.status(200).json({ success: true, message: "Fee structure deleted successfully" });

    } catch (err) {
      console.error("deleteFeeStructure error:", err);
      return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  },

  // ========================= CREATE FEE PAYMENT =========================
  createFeePayment: async (req, res) => {
    try {
      const { studentId, feeStructureId, amount, paymentMethod, paymentDate, dueDate, month, notes } = req.body;
      const recordedBy = req.user?.id;

      // Validation
      if (!studentId || !feeStructureId || !amount || !dueDate || !month) {
        return res.status(400).json({
          success: false,
          message: "studentId, feeStructureId, amount, dueDate, and month are required"
        });
      }

      if (!recordedBy) {
        return res.status(400).json({ success: false, message: "recordedBy (logged-in user) is required" });
      }

      // Check if student exists
      const student = await Student.findByPk(studentId);
      if (!student) return res.status(404).json({ success: false, message: "Student not found" });

      // Check if fee structure exists
      const feeStructure = await FeeStructure.findByPk(feeStructureId);
      if (!feeStructure) return res.status(404).json({ success: false, message: "Fee structure not found" });

      // Find or create StudentFeeStructure
      const [studentFee, created] = await StudentFeeStructure.findOrCreate({
        where: { studentId, feeStructureId },
        defaults: { finalAmount: amount, status: 'active' }
      });

      // Update total if already exists
      if (!created) {
        const totalFee = feeStructure.tuitionFee + feeStructure.admissionFee + feeStructure.examFee +
          feeStructure.libraryFee + feeStructure.sportsFee + feeStructure.otherFee;

        await studentFee.update({
          finalAmount: (studentFee.finalAmount || 0) + amount,
          status: ((studentFee.finalAmount || 0) + amount >= totalFee) ? 'completed' : 'active'
        });
      }

      // Generate unique transaction ID
      const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Create FeePayment
      const payment = await FeePayment.create({
        studentId,
        feeStructureId,
        studentFeeStructureId: studentFee.id,  // ✅ assigned
        amount,
        paymentMethod: paymentMethod || 'cash',
        paymentDate: paymentDate || new Date(),
        dueDate,
        month,
        recordedBy,  // ✅ assigned
        notes: notes || null,
        status: 'paid',
        transactionId // ✅ assigned
      });

      return res.status(201).json({
        success: true,
        message: "Payment recorded successfully",
        data: payment
      });

    } catch (err) {
      console.error("createFeePayment error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message
      });
    }
  }
  ,
  // ========================= GET ALL PAYMENTS OF STUDENT =========================
  getStudentPayments: async (req, res) => {
    try {
      const { studentId } = req.params;

      const payments = await FeePayment.findAll({
        where: { studentId },
        include: [
          { model: FeeStructure, as: 'feeStructure' },
          { model: Student, as: 'student', attributes: ['id', 'firstName', 'lastName', 'rollNumber'] }
        ],
        order: [['paymentDate', 'DESC']]
      });

      return res.status(200).json({ success: true, data: payments });
    } catch (err) {
      console.error("getStudentPayments error:", err);
      return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  },

  // ========================= GET SINGLE FEE PAYMENT BY ID =========================
  getFeePaymentById: async (req, res) => {
    try {
      const { id, studentId } = req.params;

      const payment = await FeePayment.findOne({
        where: { id, studentId },
        include: [
          { model: Student, as: 'student', attributes: ['id', 'firstName', 'lastName', 'rollNumber'] },
          { model: FeeStructure, as: 'feeStructure' }
        ]
      });

      if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

      return res.status(200).json({ success: true, data: payment });
    } catch (err) {
      console.error("getFeePaymentById error:", err);
      return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  },

  getAllPayments: async (req, res) => {
    try {
      const { academyId } = req.params;

      const payments = await FeePayment.findAll({
        include: [
          {
            model: FeeStructure,
            as: 'feeStructure',
            where: { academyId },
            attributes: ['id', 'tuitionFee', 'admissionFee', 'examFee', 'libraryFee', 'sportsFee', 'otherFee']
          },
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName']
          }
        ],
        order: [['paymentDate', 'DESC']]
      });

      return res.status(200).json({ success: true, data: payments });
    } catch (err) {
      console.error("getAllPayments error:", err);
      return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }

};

module.exports = FeeController;
