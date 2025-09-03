// src/routes/teacherRoutes.js
const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController");
const { authMiddleware, adminAuth } = require("../middleware/authMiddleware");

// ==================== TEACHER ROUTES ====================

// ✅ Create teacher under an academy (Admins only)
router.post(
  "/academies/:academyId/teachers",
  authMiddleware,
  adminAuth,
  teacherController.createTeacher
);

// ✅ Get all teachers for an academy (Authenticated users)
router.get(
  "/academies/:academyId/teachers",
  authMiddleware,
  teacherController.getTeachersByAcademy
);

// ✅ Get single teacher by ID (Authenticated users)
router.get(
  "/teachers/:id",
  authMiddleware,
  teacherController.getTeacherById
);

// ✅ Update teacher (Admins only)
router.put(
  "/teachers/:id",
  authMiddleware,
  adminAuth,
  teacherController.updateTeacher
);

// ✅ Delete teacher (Admins only)
router.delete(
  "/teachers/:id",
  authMiddleware,
  adminAuth,
  teacherController.deleteTeacher
);

module.exports = router;
