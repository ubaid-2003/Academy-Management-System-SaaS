'use strict';

module.exports = (sequelize, DataTypes) => {
  const Exam = sequelize.define('Exam', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    examType: {
      type: DataTypes.ENUM('Midterm', 'Final', 'Quiz', 'Assignment', 'Other'),
      allowNull: false
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    totalMarks: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    passingMarks: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    classId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    academyId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'exams'
  });

  // DO NOT define associations here to avoid duplicate alias errors
  Exam.associate = (models) => { /* optional placeholder */ };

  return Exam;
};
