const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const { authMiddleware, adminAuth } = require("../middleware/authMiddleware");

// ==================== STUDENT ROUTES ====================

// ✅ Create student under an academy (Admins only)
router.post(  "/academies/:academyId/students",

  authMiddleware,
  adminAuth,
  studentController.createStudent
);

// ✅ Get all students for an academy (Authenticated users)
router.get(
  "/academies/:academyId/students",
  authMiddleware,
  studentController.getStudentsByAcademy
);

// ✅ Get single student by ID (Authenticated users)
router.get(
  "/students/:id",
  authMiddleware,
  studentController.getStudentById
);

// ✅ Update student (Admins only)
router.put(
  "/students/:id",
  authMiddleware,
  adminAuth,
  studentController.updateStudent
);

// ✅ Delete student (Admins only)
router.delete(
  "/students/:id",
  authMiddleware,
  adminAuth,
  studentController.deleteStudent
);

module.exports = router;
