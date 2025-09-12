'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class StudentAttendance extends Model {
    static associate(models) {
      StudentAttendance.belongsTo(models.Student, { foreignKey: 'studentId', as: 'Student' });
      StudentAttendance.belongsTo(models.Class, { foreignKey: 'classId', as: 'Class' });
      StudentAttendance.belongsTo(models.Course, { foreignKey: 'courseId', as: 'Course' });
      StudentAttendance.belongsTo(models.Academy, { foreignKey: 'academyId', as: 'Academy' });
    }
  }

  StudentAttendance.init(
    {
      studentId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      classId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      courseId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      academyId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['present', 'absent', 'late', 'leave']],
        },
      },
    },
    {
      sequelize,
      modelName: 'StudentAttendance',
      tableName: 'student_attendances',
      timestamps: true,
    }
  );

  return StudentAttendance;
};
