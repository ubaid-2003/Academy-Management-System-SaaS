// controllers/teacherController.js
const { sequelize, Academy, Teacher, Student, TeacherStudents, UserAcademy } = require("../models");
const { Op } = require("sequelize");

exports.createTeacher = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.user?.id;
    const role = req.user?.role?.toLowerCase();

    if (!userId) {
      await t.rollback();
      return res.status(401).json({ message: "Unauthorized: You must be logged in" });
    }
    if (!["admin", "academy_admin"].includes(role)) {
      await t.rollback();
      return res.status(403).json({ message: "Forbidden: Only academy admins can create teachers" });
    }

    // ✅ Get academyId from UserAcademy junction
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
      studentIds, // optional linking
    } = req.body;

    // Auto-generate employeeId if missing
    if (!employeeId) {
      const lastTeacher = await Teacher.findOne({
        where: { academyId },
        order: [["createdAt", "DESC"]],
        transaction: t,
      });
      const lastId = lastTeacher ? lastTeacher.id : 0;
      employeeId = `TEA${academyId}-${lastId + 1}`;
    }

    // Check duplicate teacher (same academy)
    const existingTeacher = await Teacher.findOne({
      where: {
        academyId,
        [Op.or]: [{ email }, { employeeId }],
      },
      transaction: t,
    });
    if (existingTeacher) {
      await t.rollback();
      return res.status(400).json({ message: "Teacher with this email or employeeId already exists in this academy" });
    }

    // ✅ Create teacher
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
        country: country || "Pakistan",
        status: status || "active",
        subjects,
        academyId,
      },
      { transaction: t }
    );

    // ✅ Link students (manual insert into TeacherStudents with academyId)
    if (Array.isArray(studentIds) && studentIds.length) {
      const students = await Student.findAll({
        where: { id: studentIds, academyId },
        transaction: t,
      });

      if (students.length) {
        const links = students.map((student) => ({
          teacherId: teacher.id,
          studentId: student.id,
          academyId,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

        await TeacherStudents.bulkCreate(links, { transaction: t });
      }
    }

    await t.commit();

    // ✅ Fetch teacher with associations
    const createdTeacher = await Teacher.findByPk(teacher.id, {
      include: [
        { model: Student, as: "students", through: { attributes: [] } },
        { model: Academy, as: "academy" },
      ],
    });

    return res.status(201).json(createdTeacher);
  } catch (error) {
    await t.rollback();
    console.error("❌ Error creating teacher:", error);
    res.status(500).json({ message: "Error creating teacher", error: error.message });
  }
};


// ==========================
// Get All Teachers by Academy
// ==========================
exports.getTeachersByAcademy = async (req, res) => {
  try {
    const { academyId } = req.params;
    const teachers = await Teacher.findAll({
      where: { academyId },
      include: [
        { model: Student, as: 'students', through: { attributes: [] } },
        { model: Academy, as: 'academy' }
      ]
    });
    res.json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ message: 'Error fetching teachers', error: error.message });
  }
};

// ==========================
// Get Single Teacher by ID
// ==========================
exports.getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findByPk(id, {
      include: [
        { model: Student, as: 'students', through: { attributes: [] } },
        { model: Academy, as: 'academy' }
      ]
    });
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.json(teacher);
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({ message: 'Error fetching teacher', error: error.message });
  }
};

// ==========================
// Update Teacher
// ==========================
exports.updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentIds, ...updateData } = req.body;

    const teacher = await Teacher.findByPk(id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    await teacher.update(updateData);

    // Update linked students
    if (Array.isArray(studentIds)) {
      const students = await Student.findAll({ where: { id: studentIds } });
      // Manually update junction table with academyId
      const junctionRecords = students.map(student => ({
        teacherId: teacher.id,
        studentId: student.id,
        academyId: teacher.academyId
      }));
      await TeacherStudents.destroy({ where: { teacherId: teacher.id } });
      if (junctionRecords.length) await TeacherStudents.bulkCreate(junctionRecords);
    }

    const updatedTeacher = await Teacher.findByPk(id, {
      include: [
        { model: Student, as: 'students', through: { attributes: [] } },
        { model: Academy, as: 'academy' }
      ]
    });

    res.json(updatedTeacher);
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(500).json({ message: 'Error updating teacher', error: error.message });
  }
};

// ==========================
// Delete Teacher
// ==========================
exports.deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findByPk(id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    await teacher.destroy();
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    res.status(500).json({ message: 'Error deleting teacher', error: error.message });
  }
};
