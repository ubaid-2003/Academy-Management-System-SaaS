const { Teacher, Student, TeacherStudent, sequelize } = require('../models');

// Helper: check if user is admin/superadmin
const isAdmin = (role) => {
  if (!role) return false;
  const r = String(role).toLowerCase();
  return r === "admin" || r === "superadmin";
};

// ==================== CREATE TEACHER ====================
exports.createTeacher = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    if (!isAdmin(req.user.role)) {
      await t.rollback();
      return res.status(403).json({ message: "Only admins can create teachers" });
    }

    const {
      firstName, lastName, email, phone, dateOfBirth, gender,
      address, city, province, country, qualification,
      subjectSpecialization, dateOfJoining, employeeId,
      emergencyContactName, emergencyContactPhone,
      bloodGroup, status, notes, studentIds // <-- optional array of student IDs
    } = req.body;

    if (!firstName || !lastName || !email) {
      await t.rollback();
      return res.status(400).json({ message: "firstName, lastName, and email are required" });
    }

    const teacher = await Teacher.create({
      firstName, lastName, email, phone, dateOfBirth, gender,
      address, city, province, country, qualification,
      subjectSpecialization, dateOfJoining, employeeId,
      emergencyContactName, emergencyContactPhone,
      bloodGroup, status, notes
    }, { transaction: t });

    // Auto-link students if studentIds provided
    if (Array.isArray(studentIds) && studentIds.length > 0) {
      await teacher.addStudents(studentIds, { transaction: t });
    }

    await t.commit();
    return res.status(201).json({ message: "Teacher created successfully", teacher });
  } catch (err) {
    await t.rollback();
    console.error("CreateTeacher error:", err);
    if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
      const messages = err.errors.map(e => e.message);
      return res.status(400).json({ errors: messages });
    }
    return res.status(500).json({ message: "Server error creating teacher", error: err.message });
  }
};

// ==================== GET ALL TEACHERS ====================
exports.getAllTeachers = async (req, res) => {
  try {
    if (!isAdmin(req.user.role)) {
      return res.status(403).json({ message: "Only admins can view teachers" });
    }

    const teachers = await Teacher.findAll({
      include: { model: Student, through: { attributes: [] }, as: 'students' }
    });

    return res.json({ teachers });
  } catch (err) {
    console.error("GetAllTeachers error:", err);
    return res.status(500).json({ message: "Server error fetching teachers", error: err.message });
  }
};

// ==================== GET TEACHER BY ID ====================
exports.getTeacherById = async (req, res) => {
  try {
    if (!isAdmin(req.user.role)) {
      return res.status(403).json({ message: "Only admins can view a teacher" });
    }

    const teacher = await Teacher.findByPk(req.params.id, {
      include: { model: Student, through: { attributes: [] }, as: 'students' }
    });

    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    return res.json(teacher);
  } catch (err) {
    console.error("GetTeacherById error:", err);
    return res.status(500).json({ message: "Server error fetching teacher", error: err.message });
  }
};

// ==================== UPDATE TEACHER ====================
exports.updateTeacher = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    if (!isAdmin(req.user.role)) {
      await t.rollback();
      return res.status(403).json({ message: "Only admins can update teachers" });
    }

    const teacher = await Teacher.findByPk(req.params.id, { transaction: t });
    if (!teacher) {
      await t.rollback();
      return res.status(404).json({ message: "Teacher not found" });
    }

    const { studentIds, ...teacherData } = req.body;

    // 🔥 Update only fields provided (avoid overwriting with undefined)
    await teacher.update(teacherData, { transaction: t, fields: Object.keys(teacherData) });

    if (Array.isArray(studentIds)) {
      await teacher.setStudents(studentIds, { transaction: t });
    }

    await t.commit();
    return res.json({ message: "Teacher updated successfully", teacher });
  } catch (err) {
    await t.rollback();
    console.error("UpdateTeacher error:", err);
    return res.status(400).json({
      message: "Error updating teacher",
      error: err.message || err,
    });
  }
};


// ==================== DELETE TEACHER ====================
exports.deleteTeacher = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    if (!isAdmin(req.user.role)) {
      await t.rollback();
      return res.status(403).json({ message: "Only admins can delete teachers" });
    }

    const teacher = await Teacher.findByPk(req.params.id, { transaction: t });
    if (!teacher) {
      await t.rollback();
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Remove all student links first
    await TeacherStudent.destroy({ where: { teacherId: teacher.id }, transaction: t });
    await teacher.destroy({ transaction: t });

    await t.commit();
    return res.json({ message: "Teacher deleted successfully" });
  } catch (err) {
    await t.rollback();
    console.error("DeleteTeacher error:", err);
    return res.status(500).json({ message: "Server error deleting teacher", error: err.message });
  }
};

// ==================== MANUALLY ASSIGN STUDENT ====================
exports.assignStudent = async (req, res) => {
  try {
    if (!isAdmin(req.user.role)) {
      return res.status(403).json({ message: "Only admins can assign students" });
    }

    const { teacherId, studentId } = req.body;
    if (!teacherId || !studentId) {
      return res.status(400).json({ message: "teacherId and studentId are required" });
    }

    const record = await TeacherStudent.create({ teacherId, studentId });
    return res.json({ message: "Student assigned successfully", record });
  } catch (err) {
    console.error("AssignStudent error:", err);
    return res.status(400).json({ message: "Error assigning student", error: err.message });
  }
};
