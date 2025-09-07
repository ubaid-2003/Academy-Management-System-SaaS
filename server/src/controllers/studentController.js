// src/controllers/studentController.js
const { Student, Teacher, Academy, TeacherStudents, sequelize } = require("../models");
const jwt = require("jsonwebtoken");

// controllers/studentController.js
const createStudent = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      firstName,
      lastName,
      email,
      phone,            // ✅ include phone
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

    // Create student
    const student = await Student.create(
      {
        firstName,
        lastName,
        email,
        phone,             // ✅ add here too
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


    // Fetch all teachers of the academy
    const teachers = await Teacher.findAll({ where: { academyId }, transaction: t });

    // Auto-link new student with all teachers in the academy
    if (teachers.length > 0) {
      const links = teachers.map(tchr => ({
        teacherId: tchr.id,
        studentId: student.id,
        academyId,
      }));

      await TeacherStudents.bulkCreate(links, {
        transaction: t,
        ignoreDuplicates: true, // prevents duplicate entries
      });
    }

    await t.commit();
    return res.status(201).json({ message: "Student created successfully", student });
  } catch (error) {
    await t.rollback();
    console.error(error);
    return res.status(500).json({ message: "Error creating student", error: error.message });
  }
};


// ==================== DELETE STUDENT ====================
const deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the student
    const student = await Student.findByPk(id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Find the related academy
    const academy = await Academy.findByPk(student.academyId);
    if (!academy) return res.status(404).json({ message: 'Academy not found' });

    // Delete the student
    await student.destroy();

    // Decrement totalStudents safely
    if (academy.totalStudents > 0) {
      await academy.decrement('totalStudents');
    }

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('DeleteStudent error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// ==================== GET STUDENTS BY ACADEMY ====================
const getStudentsByAcademy = async (req, res) => {
  try {
    const { academyId } = req.params;
    const students = await Student.findAll({
      where: { academyId },
      include: [
        { model: Teacher, as: "teachers", attributes: ["id", "firstName", "lastName"], through: { attributes: [] } },
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
        { model: Teacher, as: "primaryTeacher", attributes: ["id", "firstName", "lastName"] },
        { model: Teacher, as: "teachers", attributes: ["id", "firstName", "lastName"], through: { attributes: [] } },
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

    const student = await Student.findByPk(id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Update student fields
    await student.update(updates, { transaction: t });

    // Optional: update many-to-many teachers
    if (updates.teacherIds) {
      // Remove old links
      await TeacherStudents.destroy({ where: { studentId: id }, transaction: t });
      // Add new links
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
