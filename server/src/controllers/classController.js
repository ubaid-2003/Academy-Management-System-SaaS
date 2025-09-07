// controllers/classController.js
'use strict';

const {
  Class,
  Academy,
  Teacher,
  Student,
  ClassTeachers,
  ClassStudents,
} = require('../models');

module.exports = {
  // -----------------------------
  // Create a new class
  // -----------------------------
  async createClass(req, res) {
    try {
      const { academyId } = req.params;
      const data = req.body;

      const academy = await Academy.findByPk(academyId);
      if (!academy) return res.status(404).json({ message: 'Academy not found' });

      const newClass = await Class.create({ ...data, academyId });
      res.status(201).json({ message: 'Class created successfully', class: newClass });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating class', error: error.message });
    }
  },

  // -----------------------------
  // Get all classes in an academy
  // -----------------------------
  async getClassesByAcademy(req, res) {
    try {
      const { academyId } = req.params;

      const classes = await Class.findAll({
        where: { academyId },
        include: [
          {
            model: ClassStudents,
            as: 'studentAssignments', // must match Class.hasMany(ClassStudents, { as: 'studentAssignments' })
            include: [{ model: Student, as: 'student' }],
          },
          {
            model: ClassTeachers,
            as: 'teacherAssignments', // must match Class.hasMany(ClassTeachers, { as: 'teacherAssignments' })
            include: [{ model: Teacher, as: 'teacher' }],
          },
        ],
      });

      res.status(200).json({ classes });
    } catch (error) {
      console.error('Error fetching classes:', error);
      res.status(500).json({ message: 'Error fetching classes', error: error.message });
    }
  },

  // -----------------------------
  // Get single class by ID
  // -----------------------------
  async getClassById(req, res) {
    try {
      const { id } = req.params;

      const classData = await Class.findByPk(id, {
        include: [
          {
            model: ClassStudents,
            as: 'studentAssignments',
            include: [{ model: Student, as: 'student' }],
          },
          {
            model: ClassTeachers,
            as: 'teacherAssignments',
            include: [{ model: Teacher, as: 'teacher' }],
          },
        ],
      });

      if (!classData) return res.status(404).json({ message: 'Class not found' });

      res.status(200).json({ class: classData });
    } catch (error) {
      console.error('Error fetching class:', error);
      res.status(500).json({ message: 'Error fetching class', error: error.message });
    }
  },

  // -----------------------------
  // Update a class
  // -----------------------------
  async updateClass(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const classData = await Class.findByPk(id);
      if (!classData) return res.status(404).json({ message: 'Class not found' });

      await classData.update(updates);
      res.status(200).json({ message: 'Class updated successfully', class: classData });
    } catch (error) {
      console.error('Error updating class:', error);
      res.status(500).json({ message: 'Error updating class', error: error.message });
    }
  },

  // -----------------------------
  // Delete a class
  // -----------------------------
  async deleteClass(req, res) {
    try {
      const { id } = req.params;

      const classData = await Class.findByPk(id);
      if (!classData) return res.status(404).json({ message: 'Class not found' });

      await classData.destroy();
      res.status(200).json({ message: 'Class deleted successfully' });
    } catch (error) {
      console.error('Error deleting class:', error);
      res.status(500).json({ message: 'Error deleting class', error: error.message });
    }
  },

  // -----------------------------
  // Assign a teacher to a class (1 teacher per class)
  // -----------------------------
  async assignTeacher(req, res) {
    try {
      const { classId } = req.params;
      const { teacherId } = req.body;

      const classData = await Class.findByPk(classId);
      if (!classData) return res.status(404).json({ message: 'Class not found' });

      let assignment = await ClassTeachers.findOne({ where: { classId } });

      if (assignment) {
        assignment.teacherId = teacherId;
        await assignment.save();
      } else {
        await ClassTeachers.create({ classId, teacherId });
      }

      res.status(200).json({ message: 'Teacher assigned successfully' });
    } catch (error) {
      console.error('Error assigning teacher:', error);
      res.status(500).json({ message: 'Error assigning teacher', error: error.message });
    }
  },

  // -----------------------------
  // Assign multiple students to a class
  // -----------------------------
  async assignStudents(req, res) {
    try {
      const { classId } = req.params;
      const { studentIds } = req.body;

      const classData = await Class.findByPk(classId);
      if (!classData) return res.status(404).json({ message: 'Class not found' });

      if (!Array.isArray(studentIds) || studentIds.length === 0)
        return res.status(400).json({ message: 'No students provided' });

      // Remove old assignments
      await ClassStudents.destroy({ where: { classId } });

      // Bulk insert new assignments
      const bulkData = studentIds.map((studentId) => ({ classId, studentId }));
      await ClassStudents.bulkCreate(bulkData);

      res.status(200).json({ message: 'Students assigned successfully', assigned: bulkData });
    } catch (error) {
      console.error('Error assigning students:', error);
      res.status(500).json({ message: 'Error assigning students', error: error.message });
    }
  },
};
