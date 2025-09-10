'use strict';

module.exports = (sequelize, DataTypes) => {
  const ExamAssignment = sequelize.define(
    'ExamAssignment',
    {
      examId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: true, // nullable for teacher assignments
      },
      teacherId: {
        type: DataTypes.INTEGER,
        allowNull: true, // nullable for student assignments
      },
      classId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: 'exam_assignments',
    }
  );

  ExamAssignment.associate = (models) => {
    ExamAssignment.belongsTo(models.Exam, { foreignKey: 'examId' });
    ExamAssignment.belongsTo(models.Student, { foreignKey: 'studentId' });
    ExamAssignment.belongsTo(models.Teacher, { foreignKey: 'teacherId' });
    ExamAssignment.belongsTo(models.Class, { foreignKey: 'classId' });
  };

  return ExamAssignment;
};
