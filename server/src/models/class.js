// models/Class.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    static associate(models) {
      // A Class belongs to an Academy
      Class.belongsTo(models.Academy, {
        foreignKey: 'academyId',
        as: 'academy',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // A Class has many Students (direct assignment)
      Class.hasMany(models.Student, {
        foreignKey: 'classId',
        as: 'students',
        onDelete: 'SET NULL',
      });

      // A Class has many ClassStudents (junction table)
      Class.hasMany(models.ClassStudents, {
        foreignKey: 'classId',
        as: 'studentAssignments',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // A Class has many ClassTeachers (junction table)
      Class.hasMany(models.ClassTeachers, {
        foreignKey: 'classId',
        as: 'teacherAssignments',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // Many-to-Many relationship with Teachers through ClassTeachers
      Class.belongsToMany(models.Teacher, {
        through: models.ClassTeachers,
        foreignKey: 'classId',
        otherKey: 'teacherId',
        as: 'teachers',
      });

      // Class has many exams
      Class.hasMany(models.Exam, { foreignKey: "classId", as: "exams" });

      // Class has many courses
      Class.hasMany(models.Course, { foreignKey: 'classId', as: 'courses' });

      // 🔹 Fee Associations
      Class.hasOne(models.FeeStructure, {
        foreignKey: 'classId',
        as: 'feeStructure',
        onDelete: 'CASCADE',
      });
    }
  }

  Class.init(
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      section: { type: DataTypes.STRING },
      gradeLevel: { type: DataTypes.STRING, allowNull: false },
      academicYear: { type: DataTypes.STRING, allowNull: false },
      shift: { type: DataTypes.ENUM('Morning', 'Evening') },
      medium: { type: DataTypes.ENUM('English', 'Urdu') },
      capacity: { type: DataTypes.INTEGER.UNSIGNED },
      status: { type: DataTypes.ENUM('active', 'inactive'), defaultValue: 'active' },
      academyId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    },
    {
      sequelize,
      modelName: 'Class',
      tableName: 'classes',
      timestamps: true,
    }
  );

  return Class;
};
