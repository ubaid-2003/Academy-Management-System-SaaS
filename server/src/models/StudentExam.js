'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class StudentExam extends Model {
    static associate(models) {
      // Define associations here if needed
      StudentExam.belongsTo(models.Student, {
        foreignKey: 'studentId',
        as: 'student'
      });
      StudentExam.belongsTo(models.Exam, {
        foreignKey: 'examId',
        as: 'exam'
      });
    }
  }

  StudentExam.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    studentId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    examId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    marks: { type: DataTypes.DECIMAL(5,2), allowNull: true },
    status: { 
      type: DataTypes.ENUM('scheduled','completed','absent'), 
      defaultValue: 'scheduled' 
    },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    sequelize,
    modelName: 'StudentExam',
    tableName: 'student_exams',
    timestamps: true
  });

  return StudentExam;
};
