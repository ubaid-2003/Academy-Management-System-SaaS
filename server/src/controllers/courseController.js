const { Course, Class, Teacher, Student } = require('../models');
const { Op } = require("sequelize");

// Helper: get current academy
const getCurrentAcademy = (req, paramsAcademyId) => {
    return req.user.currentAcademy || paramsAcademyId;
};

module.exports = {

    // =================== CREATE COURSE ===================
    createCourse: async (req, res) => {
        try {
            const academyId = getCurrentAcademy(req, req.params.academyId);

            const {
                title, code, field, credits,
                maxStudents, status, schedule,
                duration, description, prerequisites,
                classId
            } = req.body;

            if (!classId) return res.status(400).json({ message: "Class ID is required" });

            const cls = await Class.findOne({ where: { id: classId, academyId } });
            if (!cls) return res.status(400).json({ message: "Class not found in this academy" });

            const course = await Course.create({
                title, code, field, credits, maxStudents,
                status, schedule, duration, description,
                prerequisites: prerequisites || "",
                classId
            });

            res.status(201).json({ message: "Course created", course });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error", error: err.message });
        }
    },

    // =================== GET SINGLE COURSE ===================
    getCourseById: async (req, res) => {
        try {
            const academyId = getCurrentAcademy(req, req.params.academyId);
            const { id } = req.params;

            const course = await Course.findOne({
                where: { id },
                include: [
                    { model: Class, as: 'class', where: { academyId }, attributes: ['id', 'name'] },
                    { model: Teacher, as: 'teachers', attributes: ['id', 'firstName', 'lastName'] },
                    { model: Student, as: 'students', attributes: ['id', 'firstName', 'lastName'] }
                ]
            });
            if (!course) return res.status(404).json({ message: "Course not found" });

            res.status(200).json({ course });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error", error: err.message });
        }
    },

    // =================== UPDATE COURSE ===================
    updateCourse: async (req, res) => {
        try {
            const academyId = getCurrentAcademy(req, req.params.academyId);
            const { id } = req.params;

            const course = await Course.findOne({
                where: { id },
                include: [{ model: Class, as: 'class', where: { academyId } }]
            });
            if (!course) return res.status(404).json({ message: "Course not found" });

            await course.update(req.body);

            res.status(200).json({ message: "Course updated", course });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error", error: err.message });
        }
    },

    // =================== DELETE COURSE ===================
    deleteCourse: async (req, res) => {
        try {
            const academyId = getCurrentAcademy(req, req.params.academyId);
            const { id } = req.params;

            const course = await Course.findOne({
                where: { id },
                include: [{ model: Class, as: 'class', where: { academyId } }]
            });
            if (!course) return res.status(404).json({ message: "Course not found" });

            await course.destroy();
            res.status(200).json({ message: "Course deleted successfully" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error", error: err.message });
        }
    },

    // =================== GET COURSES ===================
    getCourses: async (req, res) => {
        try {
            const academyId = getCurrentAcademy(req, req.params.academyId);

            const courses = await Course.findAll({
                include: [
                    {
                        model: Class,
                        as: "class",
                        where: { academyId },
                        attributes: ["id", "name"]
                    },
                    {
                        model: Teacher,
                        as: "teachers",
                        attributes: ["id", "firstName", "lastName", "email"]
                    },
                    {
                        model: Student,
                        as: "students",
                        attributes: ["id", "firstName", "lastName", "email"]
                    }
                ]
            });

            res.status(200).json({ courses });
        } catch (err) {
            console.error("Error fetching courses:", err);
            res.status(500).json({ message: "Server error", error: err.message });
        }
    },

    // =================== ASSIGN TEACHERS ===================
    assignTeachers: async (req, res) => {
        try {
            const academyId = getCurrentAcademy(req, req.params.academyId);
            const { courseId } = req.params;
            const { teacherIds } = req.body;

            const course = await Course.findOne({
                where: { id: courseId },
                include: [{ model: Class, as: 'class', where: { academyId } }]
            });

            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }

            const validTeachers = await Teacher.findAll({
                where: { id: teacherIds, academyId },
                attributes: [
                    'id', 'firstName', 'lastName', 'email',
                    'qualification', 'experienceYears', 'subjects'
                ]
            });

            await course.setTeachers(validTeachers);

            // reload course with updated teachers
            const updatedCourse = await Course.findByPk(courseId, {
                include: [
                    { model: Teacher, as: 'teachers' },
                    { model: Student, as: 'students' },
                    { model: Class, as: 'class' }
                ]
            });

            return res.status(200).json({
                message: "Teachers assigned successfully",
                course: updatedCourse
            });
        } catch (error) {
            console.error("Error assigning teachers:", error);
            res.status(500).json({ message: "Error assigning teachers" });
        }
    }
    ,

    // =================== ENROLL STUDENTS ===================
    enrollStudents: async (req, res) => {
        try {
            const academyId = getCurrentAcademy(req, req.params.academyId);
            const { courseId } = req.params;
            const { studentIds } = req.body;

            const course = await Course.findOne({
                where: { id: courseId },
                include: [{ model: Class, as: "class", where: { academyId } }]
            });

            if (!course) {
                return res.status(404).json({ message: "Course not found in this academy" });
            }

            let relevantStudents;

            if (studentIds && studentIds.length > 0) {
                relevantStudents = await Student.findAll({
                    where: { id: studentIds, academyId },
                    attributes: ["id", "firstName", "lastName", "email"]
                });
            } else {
                relevantStudents = [];
            }

            if (relevantStudents.length === 0) {
                return res.status(404).json({ message: "No students found to enroll" });
            }

            // ✅ Add students to the course
            await course.addStudents(relevantStudents);

            // ✅ Re-fetch updated course with students
            const updatedCourse = await Course.findByPk(course.id, {
                include: [{ model: Student, as: "students", attributes: ["id", "firstName", "lastName", "email"] }]
            });

            return res.status(200).json({
                message: "Students enrolled successfully",
                course: updatedCourse
            });

        } catch (error) {
            console.error("Error enrolling students:", error);
            return res.status(500).json({ message: "Error enrolling students", error: error.message });
        }
    }


};
