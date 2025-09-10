'use strict';

const { Exam, ExamAssignment, ExamResult, Class, Student, Teacher, sequelize } = require('../models');

// ==================== HELPER ====================
const getCurrentAcademy = (req, paramsAcademyId) => req.user.currentAcademy || paramsAcademyId;

// ==================== CREATE EXAM ====================
const createExam = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const academyId = getCurrentAcademy(req, req.params.academyId);
    const {
      title,
      description,
      examType,
      classId,
      date,
      startTime,
      endTime,
      totalMarks,
      passingMarks,
      subject,
      studentIds = [],
      teacherIds = []
    } = req.body;

    // ---------- VALIDATION ----------
    if (!title || !examType || !classId || !date || !academyId || !subject) {
      await t.rollback();
      return res.status(400).json({ message: "Required fields missing: title, examType, classId, date, subject" });
    }

    // Check class exists
    const cls = await Class.findOne({ where: { id: classId, academyId } });
    if (!cls) {
      await t.rollback();
      return res.status(404).json({ message: "Class not found in this academy" });
    }

    // ---------- CREATE EXAM ----------
    const exam = await Exam.create({
      title,
      description,
      examType,
      classId,
      academyId,
      date,
      startTime,
      endTime,
      totalMarks,
      passingMarks,
      subject,
      createdBy: req.user.id
    }, { transaction: t });

    // ---------- ASSIGN STUDENTS ----------
    if (studentIds.length) {
      const studentAssignments = studentIds.map(id => ({
        examId: exam.id,
        studentId: id,
        classId
      }));
      await ExamAssignment.bulkCreate(studentAssignments, { transaction: t });
    }

    // ---------- ASSIGN TEACHERS ----------
    if (teacherIds.length) {
      const teacherAssignments = teacherIds.map(id => ({
        examId: exam.id,
        teacherId: id,
        classId
      }));
      await ExamAssignment.bulkCreate(teacherAssignments, { transaction: t });
    }

    await t.commit();
    res.status(201).json({ message: "Exam created successfully", exam });

  } catch (err) {
    await t.rollback();
    console.error("CreateExam error:", err);
    res.status(500).json({ message: "Server error creating exam", error: err.message });
  }
};



// ==================== UPDATE EXAM ====================
const updateExam = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const academyId = getCurrentAcademy(req, req.params.academyId);
    const { id } = req.params;

    const exam = await Exam.findOne({ where: { id, academyId } });
    if (!exam) return res.status(404).json({ message: "Exam not found in this academy" });

    await exam.update(req.body, { transaction: t });
    await t.commit();
    res.json({ message: "Exam updated successfully", exam });
  } catch (err) {
    await t.rollback();
    console.error("UpdateExam error:", err);
    res.status(500).json({ message: "Server error updating exam", error: err.message });
  }
};

// ==================== GET ALL EXAMS ====================
const getAllExams = async (req, res) => {
  try {
    const academyId = getCurrentAcademy(req, req.params.academyId);

    const exams = await Exam.findAll({
      where: { academyId },
      include: [
        { model: Class, as: 'class', attributes: ['id', 'name'] },
        { model: Teacher, as: 'teachers', through: { attributes: [] } },
        { model: Student, as: 'students', through: { attributes: [] } },
        { model: ExamResult, as: 'results' }
      ]
    });

    res.json({ exams });
  } catch (err) {
    console.error("GetAllExams error:", err);
    res.status(500).json({ message: "Server error fetching exams", error: err.message });
  }
};

// ==================== GET EXAM BY ID ====================
const getExamById = async (req, res) => {
  try {
    const academyId = getCurrentAcademy(req, req.params.academyId);
    const { id } = req.params;

    const exam = await Exam.findOne({
      where: { id, academyId },
      include: [
        { model: Class, as: 'class', attributes: ['id', 'name'] },
        { model: Teacher, as: 'teachers', through: { attributes: [] } },
        { model: Student, as: 'students', through: { attributes: [] } },
        { model: ExamResult, as: 'results' }
      ]
    });

    if (!exam) return res.status(404).json({ message: "Exam not found" });

    res.json({ exam });
  } catch (err) {
    console.error("GetExamById error:", err);
    res.status(500).json({ message: "Server error fetching exam", error: err.message });
  }
};

// ==================== DELETE EXAM ====================
const deleteExam = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const academyId = getCurrentAcademy(req, req.params.academyId);
    const { id } = req.params;

    const exam = await Exam.findOne({ where: { id, academyId } });
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    // Delete related assignments and results first
    await ExamAssignment.destroy({ where: { examId: id }, transaction: t });
    await ExamResult.destroy({ where: { examId: id }, transaction: t });

    await exam.destroy({ transaction: t });
    await t.commit();

    res.json({ message: "Exam deleted successfully" });
  } catch (err) {
    await t.rollback();
    console.error("DeleteExam error:", err);
    res.status(500).json({ message: "Server error deleting exam", error: err.message });
  }
};

// ==================== ASSIGN STUDENTS/TEACHERS ====================
const assignExam = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { examId } = req.params;
    const { studentIds = [], teacherIds = [] } = req.body;

    // Fetch exam
    const exam = await Exam.findByPk(examId);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    // Delete previous assignments
    await ExamAssignment.destroy({ where: { examId }, transaction: t });

    const assignments = [];

    // Assign students
    if (studentIds.length) {
      studentIds.forEach(studentId => {
        if (studentId) { // skip invalid
          assignments.push({
            examId,
            studentId,
            teacherId: null,
            classId: exam.classId
          });
        }
      });
    }

    // Assign teachers
    if (teacherIds.length) {
      teacherIds.forEach(teacherId => {
        if (teacherId) { // skip invalid
          assignments.push({
            examId,
            studentId: null,
            teacherId,
            classId: exam.classId
          });
        }
      });
    }

    // Bulk create all assignments
    if (assignments.length) {
      await ExamAssignment.bulkCreate(assignments, { transaction: t });
    }

    await t.commit();
    res.json({ message: "Exam assignments updated successfully" });

  } catch (err) {
    await t.rollback();
    console.error("AssignExam error:", err);
    res.status(500).json({ message: "Server error assigning exam", error: err.message });
  }
};


// ==================== GET EXAM STATS ====================
const getExamStats = async (req, res) => {
  try {
    const { examId } = req.params;

    const totalStudents = await ExamAssignment.count({ where: { examId, studentId: { [sequelize.Op.ne]: null } } });
    const totalTeachers = await ExamAssignment.count({ where: { examId, teacherId: { [sequelize.Op.ne]: null } } });
    const totalResults = await ExamResult.count({ where: { examId } });

    res.json({ examId, totalStudents, totalTeachers, totalResults });
  } catch (err) {
    console.error("GetExamStats error:", err);
    res.status(500).json({ message: "Server error fetching exam stats", error: err.message });
  }
};

module.exports = {
  createExam,
  updateExam,
  getAllExams,
  getExamById,
  deleteExam,
  assignExam,
  getExamStats
};
