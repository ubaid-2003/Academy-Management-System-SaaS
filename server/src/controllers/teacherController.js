const { Teacher, Student, TeacherStudent } = require('../models');

// Create Teacher and auto assign students
exports.createTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.create(req.body);

        const students = await Student.findAll({ where: { academyId: teacher.academyId } });
        const records = students.map(s => ({ teacherId: teacher.id, studentId: s.id }));
        if (records.length) await TeacherStudent.bulkCreate(records);

        res.status(201).json(teacher);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.findAll({ include: Student });
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTeacherById = async (req, res) => {
    try {
        const teacher = await Teacher.findByPk(req.params.id, { include: Student });
        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
        res.json(teacher);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findByPk(req.params.id);
        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
        await teacher.update(req.body);
        res.json(teacher);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findByPk(req.params.id);
        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
        await teacher.destroy();
        res.json({ message: 'Teacher deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Optional: Assign student manually
exports.assignStudent = async (req, res) => {
    try {
        const { teacherId, studentId } = req.body;
        const record = await TeacherStudent.create({ teacherId, studentId });
        res.json(record);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
