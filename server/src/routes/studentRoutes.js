const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authMiddleware, adminAuth } = require('../middleware/authMiddleware');

// Uncomment this if you want admin to create students
router.post('/', authMiddleware, adminAuth, studentController.createStudent);

router.get('/', authMiddleware, adminAuth, studentController.getAllStudents);
router.get('/:id', authMiddleware, adminAuth, studentController.getStudentById);
router.put('/:id', authMiddleware, adminAuth, studentController.updateStudent);
router.delete('/:id', authMiddleware, adminAuth, studentController.deleteStudent);

module.exports = router;
