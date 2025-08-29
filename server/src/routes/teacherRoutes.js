// routes/teacherRoutes.js
const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController");
const { authMiddleware, adminAuth } = require("../middleware/authMiddleware");

// Create a new teacher (only Admin)
router.post("/", authMiddleware, adminAuth, teacherController.createTeacher);

// Get all teachers (only Admin)
router.get("/", authMiddleware, adminAuth, teacherController.getAllTeachers);

// Get a teacher by ID (only Admin)
router.get("/:id", authMiddleware, adminAuth, teacherController.getTeacherById);

// Update a teacher by ID (only Admin)
router.put("/:id", authMiddleware, adminAuth, teacherController.updateTeacher);

// Delete a teacher by ID (only Admin)
router.delete("/:id", authMiddleware, adminAuth, teacherController.deleteTeacher);

// Assign a student to a teacher manually (optional, only Admin)
router.post(
  "/assign-student",
  authMiddleware,
  adminAuth,
  teacherController.assignStudent
);

module.exports = router;
