module.exports = (sequelize, DataTypes) => {
  const ExamResult = sequelize.define('ExamResult', {
    examId: DataTypes.INTEGER,
    studentId: DataTypes.INTEGER,
    marksObtained: DataTypes.INTEGER,
    remarks: DataTypes.STRING,
  }, { tableName: 'exam_results' });

  ExamResult.associate = (models) => {
    ExamResult.belongsTo(models.Exam, { foreignKey: 'examId' });
    ExamResult.belongsTo(models.Student, { foreignKey: 'studentId' });
  };

  return ExamResult;
};
