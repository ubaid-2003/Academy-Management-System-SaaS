// src/routes/attendanceRoutes.js
const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const { authMiddleware } = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/checkPermission");
const permissions = require("../contents/permissions");

// ==================== TEACHER ATTENDANCE ====================

// Create teacher attendance
router.post(
  "/academies/:academyId/teachers/teacherattendance",
  authMiddleware,
  checkPermission(permissions.CREATE_TEACHER_ATTENDANCE),
  attendanceController.createTeacherAttendance
);

// Get all attendance for a specific teacher
router.get(
  "/academies/:academyId/teachers/:teacherId/teacherattendance",
  authMiddleware,
  checkPermission(permissions.VIEW_TEACHER_ATTENDANCE),
  attendanceController.getTeacherAttendanceByTeacher
);

// Get single teacher attendance by ID
router.get(
  "/academies/:academyId/teachers/teacherattendance/:id",
  authMiddleware,
  checkPermission(permissions.VIEW_TEACHER_ATTENDANCE),
  attendanceController.getTeacherAttendanceById
);

// Update teacher attendance by ID
router.put(
  "/academies/:academyId/teachers/teacherattendance/:id",
  authMiddleware,
  checkPermission(permissions.UPDATE_TEACHER_ATTENDANCE),
  attendanceController.updateTeacherAttendance
);

// Delete teacher attendance by ID
router.delete(
  "/academies/:academyId/teachers/teacherattendance/:id",
  authMiddleware,
  checkPermission(permissions.DELETE_TEACHER_ATTENDANCE),
  attendanceController.deleteTeacherAttendance
);

// ==================== STUDENT ATTENDANCE ====================

// Create student attendance
router.post(
  "/academies/:academyId/class/:classId/students/studentattendance",
  authMiddleware,
  checkPermission(permissions.CREATE_STUDENT_ATTENDANCE),
  attendanceController.createStudentAttendance
);

// Get all attendance for a specific student
router.get(
  "/academies/:academyId/class/:classId/students/:studentId/studentattendance",
  authMiddleware,
  checkPermission(permissions.VIEW_STUDENT_ATTENDANCE),
  attendanceController.getStudentAttendanceByStudent
);

// Get single student attendance by ID
router.get(
  "/academies/:academyId/class/:classId/students/studentattendance/:id",
  authMiddleware,
  checkPermission(permissions.VIEW_STUDENT_ATTENDANCE),
  attendanceController.getStudentAttendanceById
);

// Update student attendance by ID
router.put(
  "/academies/:academyId/class/:classId/students/studentattendance/:id",
  authMiddleware,
  checkPermission(permissions.UPDATE_STUDENT_ATTENDANCE),
  attendanceController.updateStudentAttendance
);

// Delete student attendance by ID
router.delete(
  "/academies/:academyId/class/:classId/students/studentattendance/:id",
  authMiddleware,
  checkPermission(permissions.DELETE_STUDENT_ATTENDANCE),
  attendanceController.deleteStudentAttendance
);

module.exports = router;
