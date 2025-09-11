// models/Course.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Course extends Model {
        static associate(models) {
            // Course belongs to a Class
            this.belongsTo(models.Class, { foreignKey: 'classId', as: 'class' });

            // Course has many students through CourseStudent
            this.belongsToMany(models.Student, {
                through: models.CourseStudent,
                foreignKey: 'courseId',
                otherKey: 'studentId',
                as: 'students'
            });

            // Course has many teachers through CourseTeacher
            this.belongsToMany(models.Teacher, {
                through: models.CourseTeacher,
                foreignKey: 'courseId',
                otherKey: 'teacherId',
                as: 'teachers'
            });

            // 🔹 Fee Associations (many-to-many with FeeStructure)
            this.belongsToMany(models.FeeStructure, {
                through: models.CourseFeeStructure, // ✅ fixed: singular model
                foreignKey: 'courseId',
                otherKey: 'feeStructureId',
                as: 'feeStructures'
            });

            // Optional: hasMany relation for CourseFeeStructure if needed
            this.hasMany(models.CourseFeeStructure, {
                foreignKey: 'courseId',
                as: 'courseFeeStructures'
            });
        }
    }

    Course.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        title: { type: DataTypes.STRING, allowNull: false },
        code: { type: DataTypes.STRING, allowNull: false, unique: true },
        field: { type: DataTypes.STRING, allowNull: false },
        credits: { type: DataTypes.INTEGER, allowNull: false },
        maxStudents: { type: DataTypes.INTEGER, allowNull: false },
        status: { type: DataTypes.ENUM('Active', 'Inactive'), defaultValue: 'Active' },
        schedule: { type: DataTypes.STRING, allowNull: false },
        duration: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT },
        prerequisites: { type: DataTypes.STRING }, // comma separated
        classId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: { model: 'Classes', key: 'id' }
        }
    }, {
        sequelize,
        modelName: 'Course',
        tableName: 'courses',
    });

    return Course;
};
