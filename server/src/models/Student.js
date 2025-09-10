// models/Student.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    static associate(models) {
      // Student belongs to Academy
      Student.belongsTo(models.Academy, {
        foreignKey: 'academyId',
        as: 'academy',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      Student.associate = (models) => {
        Student.belongsToMany(models.Exam, {
          through: models.StudentExam,
          foreignKey: "studentId",
          otherKey: "examId",
          as: "exams",
        });
      };

      // Many-to-many with Teacher
      Student.belongsToMany(models.Teacher, {
        through: models.TeacherStudents,
        foreignKey: 'studentId',
        otherKey: 'teacherId',
        as: 'teachers',
      });

      // Many-to-many with Class
      Student.belongsToMany(models.Class, {
        through: models.ClassStudents,
        foreignKey: 'studentId',
        otherKey: 'classId',
        as: 'classes',
      });

      // Student enrolled in many courses
      Student.belongsToMany(models.Course, {
        through: models.CourseStudent,
        foreignKey: 'studentId',
        otherKey: 'courseId',
        as: 'courses'
      });

    }
  }

  Student.init(
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      phone: { type: DataTypes.STRING, allowNull: false },
      dateOfBirth: { type: DataTypes.DATEONLY, allowNull: false },
      gender: { type: DataTypes.ENUM('male', 'female', 'other'), allowNull: false },
      rollNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
      grade: { type: DataTypes.STRING },
      section: { type: DataTypes.STRING },
      enrollmentDate: { type: DataTypes.DATEONLY },
      bloodGroup: { type: DataTypes.STRING },
      address: { type: DataTypes.TEXT },
      city: { type: DataTypes.STRING },
      province: { type: DataTypes.STRING },
      country: { type: DataTypes.STRING, defaultValue: 'Pakistan' },
      fatherName: { type: DataTypes.STRING },
      motherName: { type: DataTypes.STRING },
      guardianName: { type: DataTypes.STRING, allowNull: false },
      guardianPhone: { type: DataTypes.STRING, allowNull: false },
      notes: { type: DataTypes.TEXT },
      status: { type: DataTypes.ENUM('active', 'inactive', 'suspended'), defaultValue: 'active' },
      academyId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      classId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'classes',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Student',
      tableName: 'students',
      timestamps: true,
    }
  );

  return Student;
};
