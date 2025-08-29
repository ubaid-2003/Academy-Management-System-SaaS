const { Student, Teacher, TeacherStudent } = require('../models');

// Create Student and auto assign teachers
exports.createStudent = async (req, res) => {
    try {
        const student = await Student.create(req.body);

        // Automatically assign all teachers from same academy
        const teachers = await Teacher.findAll({ where: { academyId: student.academyId } });
        const records = teachers.map(t => ({ teacherId: t.id, studentId: student.id }));
        if (records.length) await TeacherStudent.bulkCreate(records);

        res.status(201).json(student);
    } catch (err) {
        if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
            const messages = err.errors.map(e => e.message);
            return res.status(400).json({ errors: messages });
        }
        res.status(500).json({ error: err.message });
    }
};

exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.findAll({ include: Teacher });
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id, { include: Teacher });
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateStudent = async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });
        await student.update(req.body);
        res.json(student);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });
        await student.destroy();
        res.json({ message: 'Student deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
