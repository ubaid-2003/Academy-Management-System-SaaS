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
    tableName: 'exams',
    timestamps: true
  });

  Exam.associate = (models) => {
    // Many-to-Many with Students (via StudentExam)
    Exam.belongsToMany(models.Student, {
      through: models.StudentExam,
      foreignKey: 'examId',
      otherKey: 'studentId',
      as: 'examStudents', // Unique alias
    });


    // If you need more associations, always use unique `as` names:
    // Example: Exam.belongsToMany(models.Teacher, { ... as: 'examTeachers' });
  };

  return Exam;
};
