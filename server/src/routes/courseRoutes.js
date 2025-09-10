// src/routes/courseRoutes.js
const express = require("express");
const router = express.Router();

// Import models (if needed for advanced queries, though mostly handled in controller)
const { Course, Academy, Teacher, Student } = require("../models");

const { authMiddleware } = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/checkPermission");
const permissions = require("../contents/permissions");

const {
  createCourse,
  getCourses,          // ✅ corrected function name
  getCourseById,
  updateCourse,
  deleteCourse,
  assignTeachers,
  enrollStudents,
} = require("../controllers/courseController");

// ==================== COURSE ROUTES ====================

// Get all courses under an academy
router.get(
  "/academies/:academyId/courses",
  authMiddleware,
  checkPermission(permissions.VIEW_COURSE),
  getCourses
);

// Get single course by ID under an academy
router.get(
  "/academies/:academyId/courses/:id",
  authMiddleware,
  checkPermission(permissions.VIEW_COURSE),
  getCourseById
);

// Create a new course under an academy
router.post(
  "/academies/:academyId/courses",
  authMiddleware,
  checkPermission(permissions.CREATE_COURSE),
  createCourse
);

// Update a course by ID
router.put(
  "/academies/:academyId/courses/:id",
  authMiddleware,
  checkPermission(permissions.UPDATE_COURSE),
  updateCourse
);

// Delete a course by ID
router.delete(
  "/academies/:academyId/courses/:id",
  authMiddleware,
  checkPermission(permissions.DELETE_COURSE),
  deleteCourse
);

// ==================== ASSIGN TEACHERS ====================
router.post(
  "/academies/:academyId/courses/:courseId/assign-teachers",
  authMiddleware,
  checkPermission(permissions.ASSIGN_TEACHER),
  assignTeachers
);

// ==================== ENROLL STUDENTS ====================
router.put(
  "/academies/:academyId/courses/:courseId/enroll-students",
  authMiddleware,
  checkPermission(permissions.ENROLL_STUDENT),
  enrollStudents
);

module.exports = router;
