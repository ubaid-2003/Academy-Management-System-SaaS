const jwt = require("jsonwebtoken");
// src/controllers/studentController.js
const { Student, Teacher, Academy, TeacherStudents, sequelize } = require("../models");

// ==================== CREATE STUDENT ====================
const createStudent = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      rollNumber,
      grade,
      section,
      permanentAddress,
      currentAddress,
      city,
      province,
      country,
      guardianName,
      guardianPhone,
      guardianRelation,
      status = "active",
      teacherIds = [],
      academyId,
    } = req.body;

    // ✅ Check academy exists
    const academy = await Academy.findByPk(academyId, { transaction: t });
    if (!academy) {
      await t.rollback();
      return res.status(404).json({ message: "Academy not found" });
    }

    // ✅ Check duplicate email / rollNumber
    const existing = await Student.findOne({
      where: { email },
      transaction: t,
    });
    if (existing) {
      await t.rollback();
      return res.status(400).json({ message: "Email already exists" });
    }
    const rollCheck = await Student.findOne({
      where: { rollNumber },
      transaction: t,
    });
    if (rollCheck) {
      await t.rollback();
      return res.status(400).json({ message: "Roll number already exists" });
    }

    // ✅ Create student
    const student = await Student.create(
      {
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth,
        gender,
        rollNumber,
        grade,
        section,
        permanentAddress,
        currentAddress,
        city,
        province,
        country: country || "Pakistan",
        guardianName,
        guardianPhone,
        guardianRelation,
        academyId,
        status,
      },
      { transaction: t }
    );

    // ✅ Link student to teachers
    let links = [];
    if (teacherIds.length > 0) {
      // Use provided teacherIds
      links = teacherIds.map((teacherId) => ({
        teacherId,
        studentId: student.id,
        academyId,
      }));
    } else {
      // Auto-link with all teachers of academy
      const teachers = await Teacher.findAll({ where: { academyId }, transaction: t });
      links = teachers.map((tchr) => ({
        teacherId: tchr.id,
        studentId: student.id,
        academyId,
      }));
    }

    if (links.length > 0) {
      await TeacherStudents.bulkCreate(links, {
        transaction: t,
        ignoreDuplicates: true,
      });
    }

    // ✅ Increment totalStudents
    await academy.increment("totalStudents", { transaction: t });

    await t.commit();
    return res.status(201).json({ message: "Student created successfully", student });
  } catch (error) {
    await t.rollback();
    console.error("CreateStudent error:", error);
    return res.status(500).json({ message: "Error creating student", error: error.message });
  }
};

// ==================== DELETE STUDENT ====================
const deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await Student.findByPk(id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const academy = await Academy.findByPk(student.academyId);
    if (!academy) return res.status(404).json({ message: "Academy not found" });

    await student.destroy();

    if (academy.totalStudents > 0) {
      await academy.decrement("totalStudents");
    }

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("DeleteStudent error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ==================== GET STUDENTS BY ACADEMY ====================
const getStudentsByAcademy = async (req, res) => {
  try {
    const { academyId } = req.params;
    const students = await Student.findAll({
      where: { academyId },
      include: [
        {
          model: Teacher,
          as: "teachers",
          attributes: ["id", "firstName", "lastName"],
          through: { attributes: [] },
        },
      ],
    });
    res.json(students);
  } catch (err) {
    console.error("GetStudentsByAcademy error:", err);
    res.status(500).json({ message: "Server error fetching students", error: err.message });
  }
};

// ==================== GET SINGLE STUDENT ====================
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByPk(id, {
      include: [
        {
          model: Teacher,
          as: "teachers",
          attributes: ["id", "firstName", "lastName"],
          through: { attributes: [] },
        },
      ],
    });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    console.error("GetStudentById error:", err);
    res.status(500).json({ message: "Server error fetching student", error: err.message });
  }
};

// ==================== UPDATE STUDENT ====================
const updateStudent = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const updates = req.body;

    const student = await Student.findByPk(id, { transaction: t });
    if (!student) {
      await t.rollback();
      return res.status(404).json({ message: "Student not found" });
    }

    // ✅ Whitelist allowed fields
    const allowed = [
      "firstName",
      "lastName",
      "phone",
      "dateOfBirth",
      "gender",
      "grade",
      "section",
      "permanentAddress",
      "currentAddress",
      "city",
      "province",
      "country",
      "guardianName",
      "guardianPhone",
      "guardianRelation",
      "status",
    ];
    const safeUpdates = {};
    allowed.forEach((f) => {
      if (updates[f] !== undefined) safeUpdates[f] = updates[f];
    });

    await student.update(safeUpdates, { transaction: t });

    // ✅ Update teacher relations if provided
    if (updates.teacherIds) {
      await TeacherStudents.destroy({ where: { studentId: id }, transaction: t });
      const links = updates.teacherIds.map((teacherId) => ({
        teacherId,
        studentId: id,
        academyId: student.academyId,
      }));
      await TeacherStudents.bulkCreate(links, { transaction: t });
    }

    await t.commit();
    res.json({ message: "Student updated successfully", student });
  } catch (err) {
    await t.rollback();
    console.error("UpdateStudent error:", err);
    res.status(500).json({ message: "Server error updating student", error: err.message });
  }
};

module.exports = {
  createStudent,
  getStudentsByAcademy,
  getStudentById,
  updateStudent,
  deleteStudent,
};
