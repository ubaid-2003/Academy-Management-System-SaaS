'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TeacherAttendance extends Model {
    static associate(models) {
      TeacherAttendance.belongsTo(models.Teacher, { foreignKey: 'teacherId', as: 'Teacher' });
      TeacherAttendance.belongsTo(models.Academy, { foreignKey: 'academyId', as: 'Academy' });
    }
  }

  TeacherAttendance.init(
    {
      teacherId: {
        type: DataTypes.INTEGER.UNSIGNED, // must match migration
        allowNull: false,
      },
      academyId: {
        type: DataTypes.INTEGER.UNSIGNED, // must match migration
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
          isIn: [['present', 'absent', 'late', 'leave']], // optional
        },
      },
    },
    {
      sequelize,
      modelName: 'TeacherAttendance',
      tableName: 'teacher_attendances',
      timestamps: true,
    }
  );

  return TeacherAttendance;
};
