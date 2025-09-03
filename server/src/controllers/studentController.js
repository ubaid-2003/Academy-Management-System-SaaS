// controllers/studentController.js
const db = require("../models");
const { Op } = require("sequelize");

const { sequelize, Academy, Student, Teacher, TeacherStudents, UserAcademy } = db;

exports.createStudent = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    console.log("✅ Available models:", Object.keys(db)); 

    const userId = req.user?.id;
    const role = req.user?.role?.toLowerCase();

    if (!userId) {
      await t.rollback();
      return res.status(401).json({ message: "Unauthorized: You must be logged in" });
    }
    if (!["admin", "academy_admin"].includes(role)) {
      await t.rollback();
      return res.status(403).json({ message: "Forbidden: Only academy admins can create students" });
    }

    const userAcademy = await UserAcademy.findOne({ where: { userId }, transaction: t });
    if (!userAcademy) {
      await t.rollback();
      return res.status(403).json({ message: "You are not linked to any academy" });
    }

    const academyId = userAcademy.academyId;
    let {
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
      teacherIds,
      status,
    } = req.body;

    // Auto-generate rollNumber
    if (!rollNumber) {
      const lastStudent = await Student.findOne({
        where: { academyId },
        order: [["createdAt", "DESC"]],
        transaction: t,
      });

      const lastId = lastStudent ? lastStudent.id : 0;
      rollNumber = `STU${academyId}-${lastId + 1}`;
    }

    const existingStudent = await Student.findOne({
      where: {
        academyId,
        [Op.or]: [{ rollNumber }, { email }],
      },
      transaction: t,
    });
    if (existingStudent) {
      await t.rollback();
      return res.status(400).json({ message: "Student with this rollNumber or email already exists in this academy" });
    }

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
        status: status || "active",
      },
      { transaction: t }
    );

    // ✅ Manually insert teacher-student links with academyId
    if (Array.isArray(teacherIds) && teacherIds.length) {
      const teachers = await Teacher.findAll({
        where: { id: teacherIds, academyId },
        transaction: t,
      });

      if (teachers.length) {
        const teacherLinks = teachers.map((teacher) => ({
          teacherId: teacher.id,
          studentId: student.id,
          academyId: academyId,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

        await TeacherStudents.bulkCreate(teacherLinks, { transaction: t });
      }
    }

    await t.commit();

    const createdStudent = await Student.findByPk(student.id, {
      include: [
        { model: Teacher, as: "teachers", through: { attributes: [] } },
        { model: Academy, as: "academy" },
      ],
    });

    return res.status(201).json(createdStudent);
  } catch (error) {
    await t.rollback();
    console.error("❌ Error creating student:", error);
    res.status(500).json({ message: "Error creating student", error: error.message });
  }
};


// ==========================
// Get All Students by Academy
// ==========================
exports.getStudentsByAcademy = async (req, res) => {
  try {
    const { academyId } = req.params;
    const students = await Student.findAll({
      where: { academyId },
      include: [
        { model: Teacher, as: 'teachers', through: { attributes: [] } },
        { model: Academy, as: 'academy' }
      ]
    });
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
};

// ==========================
// Get Single Student by ID
// ==========================
exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByPk(id, {
      include: [
        { model: Teacher, as: 'teachers', through: { attributes: [] } },
        { model: Academy, as: 'academy' }
      ]
    });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ message: 'Error fetching student', error: error.message });
  }
};

// ==========================
// Update Student
// ==========================
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { teacherIds, ...updateData } = req.body;

    const student = await Student.findByPk(id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    await student.update(updateData);

    // Update teachers in junction table
    if (Array.isArray(teacherIds)) {
      const teachers = await Teacher.findAll({ where: { id: teacherIds } });
      await student.setTeachers(teachers);
    }

    const updatedStudent = await Student.findByPk(id, {
      include: [
        { model: Teacher, as: 'teachers', through: { attributes: [] } },
        { model: Academy, as: 'academy' }
      ]
    });

    res.json(updatedStudent);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Error updating student', error: error.message });
  }
};

// ==========================
// Delete Student
// ==========================
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByPk(id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    await student.destroy();
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Error deleting student', error: error.message });
  }
};
