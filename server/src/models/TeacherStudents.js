'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TeacherStudents extends Model {
    static associate(models) {
      TeacherStudents.belongsTo(models.Teacher, {
        foreignKey: 'teacherId',
        as: 'teacher',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      TeacherStudents.belongsTo(models.Student, {
        foreignKey: 'studentId',
        as: 'student',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      TeacherStudents.belongsTo(models.Academy, {
        foreignKey: 'academyId',
        as: 'academy',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }

  TeacherStudents.init(
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      teacherId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'teachers', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      studentId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'students', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      academyId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'academies', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
    },
    {
      sequelize,
      modelName: 'TeacherStudents',
      tableName: 'teacher_students',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['teacherId', 'studentId', 'academyId']
        }
      ]
    }
  );

  return TeacherStudents;
};
