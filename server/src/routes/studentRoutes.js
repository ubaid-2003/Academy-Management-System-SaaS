// src/routes/studentRoutes.js
const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const { authMiddleware } = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/checkPermission");
const permissions = require("../contents/permissions");

// ==================== STUDENT ROUTES ====================

// Create student under an academy (requires CREATE_STUDENT permission)
router.post(
  "/academies/:academyId/students",
  authMiddleware,
  checkPermission(permissions.CREATE_STUDENT),
  studentController.createStudent
);

// Get all students for an academy (requires VIEW_STUDENT permission)
router.get(
  "/academies/:academyId/students",
  authMiddleware,
  checkPermission(permissions.VIEW_STUDENT),
  studentController.getStudentsByAcademy
);

// Get single student by ID (requires VIEW_STUDENT permission)
router.get(
  "/students/:id",
  authMiddleware,
  checkPermission(permissions.VIEW_STUDENT),
  studentController.getStudentById
);

// Update student (requires UPDATE_STUDENT permission)
router.put(
  "/students/:id",
  authMiddleware,
  checkPermission(permissions.UPDATE_STUDENT),
  studentController.updateStudent
);

// Delete student (requires DELETE_STUDENT permission)
router.delete(
  "/students/:id",
  authMiddleware,
  checkPermission(permissions.DELETE_STUDENT),
  studentController.deleteStudent
);

module.exports = router;
