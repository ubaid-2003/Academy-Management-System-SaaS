// routes/studentRoutes.js

const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authMiddleware, adminAuth } = require('../middleware/authMiddleware');

// ========================
// STUDENT ROUTES (Admin Only)
// ========================

// Create a new student
router.post('/', authMiddleware, adminAuth, studentController.createStudent);

// Get all students
router.get('/', authMiddleware, adminAuth, studentController.getAllStudents);

// Get single student by ID
router.get('/:id', authMiddleware, adminAuth, studentController.getStudentById);

// Update student by ID
router.put('/:id', authMiddleware, adminAuth, studentController.updateStudent);

// Delete student by ID
router.delete('/:id', authMiddleware, adminAuth, studentController.deleteStudent);

module.exports = router;
