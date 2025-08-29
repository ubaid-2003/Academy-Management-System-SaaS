const { Student, Teacher, sequelize } = require('../models');

// Helper: check if user is admin/superadmin
const isAdmin = (role) => {
    if (!role) return false;
    const r = String(role).toLowerCase();
    return r === "admin" || r === "superadmin";
};

// ==================== CREATE STUDENT ====================
exports.createStudent = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        if (!isAdmin(req.user.role)) {
            await t.rollback();
            return res.status(403).json({ message: "Only admins can create students" });
        }

        const {
            firstName, lastName, email, registrationNumber,
            class: studentClass, section, phone,
            dateOfBirth, gender, address, city, province, country,
            fatherName, motherName, guardianContact,
            bloodGroup, enrollmentDate, status, notes,
            teacherIds // <-- array of teacher IDs to link
        } = req.body;

        if (!firstName || !lastName || !email || !registrationNumber) {
            await t.rollback();
            return res.status(400).json({
                message: "firstName, lastName, email, and registrationNumber are required"
            });
        }

        // Create student
        const student = await Student.create({
            firstName, lastName, email, registrationNumber,
            class: studentClass, section, phone,
            dateOfBirth, gender, address, city, province, country,
            fatherName, motherName, guardianContact,
            bloodGroup, enrollmentDate, status, notes
        }, { transaction: t });

        // Automatically link teachers if provided
        if (Array.isArray(teacherIds) && teacherIds.length > 0) {
            await student.addTeachers(teacherIds, { transaction: t });
        }

        await t.commit();
        return res.status(201).json({ message: "Student created successfully", student });
    } catch (err) {
        await t.rollback();
        console.error("CreateStudent error:", err);
        return res.status(500).json({ message: err.message });
    }
};

// ==================== GET ALL STUDENTS ====================
exports.getAllStudents = async (req, res) => {
    try {
        if (!isAdmin(req.user.role)) {
            return res.status(403).json({ message: "Only admins can view students" });
        }

        const students = await Student.findAll({
            include: { model: Teacher, through: { attributes: [] } } // includes linked teachers
        });
        return res.json({ students });
    } catch (err) {
        console.error("GetAllStudents error:", err);
        return res.status(500).json({ message: "Server error fetching students", error: err.message });
    }
};

// ==================== GET STUDENT BY ID ====================
exports.getStudentById = async (req, res) => {
    try {
        if (!isAdmin(req.user.role)) {
            return res.status(403).json({ message: "Only admins can view a student" });
        }

        const student = await Student.findByPk(req.params.id, {
            include: { model: Teacher, through: { attributes: [] } }
        });

        if (!student) return res.status(404).json({ message: "Student not found" });
        return res.json(student);
    } catch (err) {
        console.error("GetStudentById error:", err);
        return res.status(500).json({ message: "Server error fetching student", error: err.message });
    }
};

// ==================== UPDATE STUDENT ====================
exports.updateStudent = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        if (!isAdmin(req.user.role)) {
            await t.rollback();
            return res.status(403).json({ message: "Only admins can update students" });
        }

        const student = await Student.findByPk(req.params.id, { transaction: t });
        if (!student) {
            await t.rollback();
            return res.status(404).json({ message: "Student not found" });
        }

        const { teacherIds, ...studentData } = req.body;

        // Update student info
        await student.update(studentData, { transaction: t });

        // Update linked teachers if provided
        if (Array.isArray(teacherIds)) {
            await student.setTeachers(teacherIds, { transaction: t }); // replaces old links
        }

        await t.commit();
        return res.json({ message: "Student updated successfully", student });
    } catch (err) {
        await t.rollback();
        console.error("UpdateStudent error:", err);
        return res.status(400).json({ message: "Error updating student", error: err.message });
    }
};

// ==================== DELETE STUDENT ====================
exports.deleteStudent = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        if (!isAdmin(req.user.role)) {
            await t.rollback();
            return res.status(403).json({ message: "Only admins can delete students" });
        }

        const student = await Student.findByPk(req.params.id, { transaction: t });
        if (!student) {
            await t.rollback();
            return res.status(404).json({ message: "Student not found" });
        }

        // Remove relationships first
        await student.setTeachers([], { transaction: t });

        await student.destroy({ transaction: t });
        await t.commit();

        return res.json({ message: "Student deleted successfully" });
    } catch (err) {
        await t.rollback();
        console.error("DeleteStudent error:", err);
        return res.status(500).json({ message: "Server error deleting student", error: err.message });
    }
};
