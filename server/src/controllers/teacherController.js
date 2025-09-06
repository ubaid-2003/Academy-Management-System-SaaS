// src/controllers/teacherController.js
const { Teacher, Student, Academy, TeacherStudents, sequelize } = require("../models");

// ==================== CREATE TEACHER ====================

const createTeacher = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { firstName, lastName, email, phone, gender, dateOfBirth, employeeId, qualification, experienceYears, address, city, province, country, status, subjects, academyId } = req.body;

    // Create the teacher
    const teacher = await Teacher.create(
      {
        firstName,
        lastName,
        email,
        phone,
        gender,
        dateOfBirth,
        employeeId,
        qualification,
        experienceYears,
        address,
        city,
        province,
        country,
        status,
        subjects,
        academyId,
      },
      { transaction: t }
    );

    // Fetch all students of the academy
    const students = await Student.findAll({ where: { academyId }, transaction: t });

    // Auto-link new teacher with all students in the academy
    if (students.length > 0) {
      const links = students.map(std => ({
        teacherId: teacher.id,
        studentId: std.id,
        academyId,
      }));

      await TeacherStudents.bulkCreate(links, {
        transaction: t,
        ignoreDuplicates: true, // prevents duplicate entries
      });
    }

    await t.commit();
    return res.status(201).json({ message: "Teacher created successfully", teacher });
  } catch (error) {
    await t.rollback();
    console.error(error);
    return res.status(500).json({ message: "Error creating teacher", error: error.message });
  }
};


// ==================== DELETE TEACHER ====================
const deleteTeacher = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const teacher = await Teacher.findByPk(id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const academyId = teacher.academyId;

    await TeacherStudents.destroy({ where: { teacherId: id }, transaction: t });
    await teacher.destroy({ transaction: t });

    // ✅ Decrement totalTeachers
    await Academy.decrement("totalTeachers", { by: 1, where: { id: academyId }, transaction: t });

    await t.commit();
    res.json({ message: "Teacher deleted successfully" });
  } catch (err) {
    await t.rollback();
    console.error("DeleteTeacher error:", err);
    res.status(500).json({ message: "Server error deleting teacher", error: err.message });
  }
};



// ==================== GET TEACHERS BY ACADEMY ====================
const getTeachersByAcademy = async (req, res) => {
  try {
    const { academyId } = req.params;

    const teachers = await Teacher.findAll({
      where: { academyId },
      include: [
        { model: Student, as: "students", attributes: ["id", "firstName", "lastName"], through: { attributes: [] } },
      ],
    });

    res.json(teachers);
  } catch (err) {
    console.error("GetTeachersByAcademy error:", err);
    res.status(500).json({ message: "Server error fetching teachers", error: err.message });
  }
};

// ==================== GET SINGLE TEACHER ====================
const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findByPk(id, {
      include: [
        { model: Student, as: "primaryStudent", attributes: ["id", "firstName", "lastName"] },
        { model: Student, as: "students", attributes: ["id", "firstName", "lastName"], through: { attributes: [] } },
      ],
    });

    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.json(teacher);
  } catch (err) {
    console.error("GetTeacherById error:", err);
    res.status(500).json({ message: "Server error fetching teacher", error: err.message });
  }
};

// ==================== UPDATE TEACHER ====================
const updateTeacher = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const updates = req.body;

    const teacher = await Teacher.findByPk(id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    await teacher.update(updates, { transaction: t });

    if (updates.studentIds) {
      await TeacherStudents.destroy({ where: { teacherId: id }, transaction: t });
      const links = updates.studentIds.map((studentId) => ({
        teacherId: id,
        studentId,
        academyId: teacher.academyId,
      }));
      await TeacherStudents.bulkCreate(links, { transaction: t });
    }

    await t.commit();
    res.json({ message: "Teacher updated successfully", teacher });
  } catch (err) {
    await t.rollback();
    console.error("UpdateTeacher error:", err);
    res.status(500).json({ message: "Server error updating teacher", error: err.message });
  }
};

module.exports = {
  createTeacher,
  getTeachersByAcademy,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
};
