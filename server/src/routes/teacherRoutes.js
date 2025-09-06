// src/routes/teacherRoutes.js
const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController");
const { authMiddleware } = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/checkPermission");
const permissions = require("../contents/permissions");

// ==================== TEACHER ROUTES ====================

// Create teacher under an academy (requires CREATE_TEACHER permission)
router.post(
  "/academies/:academyId/teachers",
  authMiddleware,
  checkPermission(permissions.CREATE_TEACHER),
  teacherController.createTeacher
);

// Get all teachers for an academy (requires VIEW_TEACHER permission)
router.get(
  "/academies/:academyId/teachers",
  authMiddleware,
  checkPermission(permissions.VIEW_TEACHER),
  teacherController.getTeachersByAcademy
);

// Get single teacher by ID (requires VIEW_TEACHER permission)
router.get(
  "/teachers/:id",
  authMiddleware,
  checkPermission(permissions.VIEW_TEACHER),
  teacherController.getTeacherById
);

// Update teacher (requires UPDATE_TEACHER permission)
router.put(
  "/teachers/:id",
  authMiddleware,
  checkPermission(permissions.UPDATE_TEACHER),
  teacherController.updateTeacher
);

// Delete teacher (requires DELETE_TEACHER permission)
router.delete(
  "/teachers/:id",
  authMiddleware,
  checkPermission(permissions.DELETE_TEACHER),
  teacherController.deleteTeacher
);

module.exports = router;
