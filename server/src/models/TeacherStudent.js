'use strict';
module.exports = (sequelize, DataTypes) => {
  const TeacherStudent = sequelize.define('TeacherStudent', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    teacherId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: 'teachers', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    studentId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: 'students', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  }, {
    tableName: 'teacher_students',
    timestamps: true,
  });

  return TeacherStudent;
};
