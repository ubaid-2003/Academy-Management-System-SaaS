const { Class, Academy, Teacher, Student, ClassTeachers } = require("../models");

module.exports = {
  // Create a new class
  async createClass(req, res) {
    try {
      const { academyId } = req.params; // Academy ID from route
      const data = req.body;

      const academy = await Academy.findByPk(academyId);
      if (!academy) return res.status(404).json({ message: "Academy not found" });

      const newClass = await Class.create({ ...data, academyId });
      res.status(201).json({ message: "Class created successfully", class: newClass });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating class", error: error.message });
    }
  },

  // Get all classes in a specific academy
  async getClassesByAcademy(req, res) {
    try {
      const { academyId } = req.params;

      const classes = await Class.findAll({
        where: { academyId },
        include: [
          { model: Student, as: "students" },
          { model: Teacher, as: "teachers" },
        ],
      });

      res.status(200).json({ classes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching classes", error: error.message });
    }
  },

  // Get single class by ID
  async getClassById(req, res) {
    try {
      const { id } = req.params;

      const classData = await Class.findByPk(id, {
        include: [
          { model: Student, as: "students" },
          { model: Teacher, as: "teachers" },
        ],
      });

      if (!classData) return res.status(404).json({ message: "Class not found" });

      res.status(200).json({ class: classData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching class", error: error.message });
    }
  },

  // Update a class
  async updateClass(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const classData = await Class.findByPk(id);
      if (!classData) return res.status(404).json({ message: "Class not found" });

      await classData.update(updates);
      res.status(200).json({ message: "Class updated successfully", class: classData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating class", error: error.message });
    }
  },

  // Delete a class
  async deleteClass(req, res) {
    try {
      const { id } = req.params;

      const classData = await Class.findByPk(id);
      if (!classData) return res.status(404).json({ message: "Class not found" });

      await classData.destroy();
      res.status(200).json({ message: "Class deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting class", error: error.message });
    }
  },
};

