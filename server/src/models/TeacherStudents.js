// models/TeacherStudents.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TeacherStudents extends Model {
    static associate(models) {
      // Keep onDelete/onUpdate here so sequelize is aware of intent.
      // (DB-level FK behavior is applied when you create the FK in a migration or use sync with references.)
      TeacherStudents.belongsTo(models.Teacher, {
        foreignKey: 'teacherId',
        as: 'teacher',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      TeacherStudents.belongsTo(models.Student, {
        foreignKey: 'studentId',
        as: 'student',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      TeacherStudents.belongsTo(models.Academy, {
        foreignKey: 'academyId',
        as: 'academy',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  TeacherStudents.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      teacherId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'teachers', // table name (migration/table must match)
          key: 'id',
        },
      },
      studentId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'students',
          key: 'id',
        },
      },
      academyId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'academies',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'TeacherStudents',
      tableName: 'teacher_students',
      timestamps: true,
      indexes: [
        // prevent duplicate triples (teacher, student, academy)
        { unique: true, fields: ['teacherId', 'studentId', 'academyId'] },
        // helpful indexes for lookups
        { fields: ['teacherId'] },
        { fields: ['studentId'] },
        { fields: ['academyId'] },
      ],
    }
  );

  return TeacherStudents;
};
