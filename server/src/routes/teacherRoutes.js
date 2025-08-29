const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { authMiddleware, adminAuth } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, adminAuth, teacherController.createTeacher);
router.get('/', authMiddleware, adminAuth, teacherController.getAllTeachers);
router.get('/:id', authMiddleware, adminAuth, teacherController.getTeacherById);
router.put('/:id', authMiddleware, adminAuth, teacherController.updateTeacher);
router.delete('/:id', authMiddleware, adminAuth, teacherController.deleteTeacher);

// Assign student to teacher manually (optional)
router.post('/assign-student', authMiddleware, adminAuth, teacherController.assignStudent);

module.exports = router;
