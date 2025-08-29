const { TeacherStudent } = require('../models');

const assignToJunction = async (req, res, next) => {
  try {
    const { studentId, teacherId } = req.body;

    // Only create if both IDs exist
    if (studentId && teacherId) {
      await TeacherStudent.create({ studentId, teacherId });
    }

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to assign in junction table' });
  }
};

module.exports = assignToJunction;
