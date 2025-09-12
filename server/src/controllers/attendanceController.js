'use strict';

const {
  TeacherAttendance,
  StudentAttendance,
  Teacher,
  Student,
  Class,
  Course,
  Academy
} = require('../models');

const VALID_STATUS = ['present', 'absent', 'late', 'leave'];

// --------------------- TEACHER ATTENDANCE ---------------------

// Create Teacher Attendance
const createTeacherAttendance = async (req, res) => {
  try {
    let { teacherId, academyId, date, status } = req.body;

    if (!teacherId || !academyId || !date || !status) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!VALID_STATUS.includes(status.toLowerCase())) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    teacherId = parseInt(teacherId);
    academyId = parseInt(academyId);

    const [teacher, academy] = await Promise.all([
      Teacher.findByPk(teacherId),
      Academy.findByPk(academyId)
    ]);

    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    if (!academy) return res.status(404).json({ message: "Academy not found" });

    const attendance = await TeacherAttendance.create({ teacherId, academyId, date, status });
    res.status(201).json({ message: "Teacher attendance created", data: attendance });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get Teacher Attendance by ID
const getTeacherAttendanceById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const attendance = await TeacherAttendance.findByPk(id, {
      include: [
        { model: Teacher, as: 'Teacher' },
        { model: Academy, as: 'Academy' }
      ]
    });

    if (!attendance) return res.status(404).json({ message: "Attendance not found" });
    res.json({ data: attendance });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all attendance for a Teacher
const getTeacherAttendanceByTeacher = async (req, res) => {
  try {
    const teacherId = parseInt(req.params.teacherId);

    const attendances = await TeacherAttendance.findAll({
      where: { teacherId },
      include: [
        { model: Teacher, as: 'Teacher' },
        { model: Academy, as: 'Academy' }
      ],
      order: [['date', 'DESC']]
    });

    res.json({ data: attendances });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update Teacher Attendance by ID
const updateTeacherAttendance = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    if (status && !VALID_STATUS.includes(status.toLowerCase())) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const attendance = await TeacherAttendance.findByPk(id);
    if (!attendance) return res.status(404).json({ message: "Attendance not found" });

    if (status) attendance.status = status;
    await attendance.save();

    res.json({ message: "Teacher attendance updated", data: attendance });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Teacher Attendance by ID
const deleteTeacherAttendance = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const deleted = await TeacherAttendance.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Attendance not found" });

    res.json({ message: "Teacher attendance deleted" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// --------------------- STUDENT ATTENDANCE ---------------------

// Create Student Attendance
const createStudentAttendance = async (req, res) => {
  try {
    const academyId = parseInt(req.params.academyId);
    const classId = parseInt(req.params.classId);
    const { studentId, courseId, date, status } = req.body;

    if (!studentId || !classId || !courseId || !academyId || !date || !status) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!VALID_STATUS.includes(status.toLowerCase())) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const [student, cls, course, academy] = await Promise.all([
      Student.findByPk(studentId),
      Class.findByPk(classId),
      Course.findByPk(courseId),
      Academy.findByPk(academyId)
    ]);

    if (!student) return res.status(404).json({ message: "Student not found" });
    if (!cls) return res.status(404).json({ message: "Class not found" });
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (!academy) return res.status(404).json({ message: "Academy not found" });

    const attendance = await StudentAttendance.create({ studentId, classId, courseId, academyId, date, status });
    res.status(201).json({ message: "Student attendance created", data: attendance });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get Student Attendance by ID
const getStudentAttendanceById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const attendance = await StudentAttendance.findByPk(id, {
      include: [
        { model: Student, as: 'Student' },
        { model: Class, as: 'Class' },
        { model: Course, as: 'Course' },
        { model: Academy, as: 'Academy' }
      ]
    });

    if (!attendance) return res.status(404).json({ message: "Attendance not found" });
    res.json({ data: attendance });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all attendance for a Student
const getStudentAttendanceByStudent = async (req, res) => {
  try {
    const studentId = parseInt(req.params.studentId);

    const attendances = await StudentAttendance.findAll({
      where: { studentId },
      include: [
        { model: Student, as: 'Student' },
        { model: Class, as: 'Class' },
        { model: Course, as: 'Course' },
        { model: Academy, as: 'Academy' }
      ],
      order: [['date', 'DESC']]
    });

    res.json({ data: attendances });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update Student Attendance by ID
const updateStudentAttendance = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    if (status && !VALID_STATUS.includes(status.toLowerCase())) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const attendance = await StudentAttendance.findByPk(id);
    if (!attendance) return res.status(404).json({ message: "Attendance not found" });

    if (status) attendance.status = status;
    await attendance.save();

    res.json({ message: "Student attendance updated", data: attendance });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Student Attendance by ID
const deleteStudentAttendance = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const deleted = await StudentAttendance.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Attendance not found" });

    res.json({ message: "Student attendance deleted" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// --------------------- EXPORT ALL ---------------------

module.exports = {
  createTeacherAttendance,
  getTeacherAttendanceById,
  getTeacherAttendanceByTeacher,
  updateTeacherAttendance,
  deleteTeacherAttendance,
  createStudentAttendance,
  getStudentAttendanceById,
  getStudentAttendanceByStudent,
  updateStudentAttendance,
  deleteStudentAttendance
};
