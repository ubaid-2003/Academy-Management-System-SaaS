'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Load all models dynamically
fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Setup associations centrally
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// ------------------ EXAM ASSOCIATIONS ------------------

// Exam belongs to Academy
db.Exam.belongsTo(db.Academy, { foreignKey: 'academyId', as: 'academy' });
db.Academy.hasMany(db.Exam, { foreignKey: 'academyId', as: 'examsFromAcademy' });

// Exam belongs to Class
db.Exam.belongsTo(db.Class, { foreignKey: 'classId', as: 'class' });
db.Class.hasMany(db.Exam, { foreignKey: 'classId', as: 'examsFromClass' });

// Exam belongs to Course (optional)
db.Exam.belongsTo(db.Course, { foreignKey: 'courseId', as: 'course' });
db.Course.hasMany(db.Exam, { foreignKey: 'courseId', as: 'examsFromCourse' });

// Exam created by Teacher/Admin
db.Exam.belongsTo(db.Teacher, { foreignKey: 'createdBy', as: 'creator' });
db.Teacher.hasMany(db.Exam, { foreignKey: 'createdBy', as: 'createdExams' });

// ExamAssignments (junction table for students & teachers)
db.Exam.belongsToMany(db.Student, {
  through: db.ExamAssignment,
  foreignKey: 'examId',
  otherKey: 'studentId',
  as: 'students'
});
db.Student.belongsToMany(db.Exam, {
  through: db.ExamAssignment,
  foreignKey: 'studentId',
  otherKey: 'examId',
  as: 'exams'
});

db.Exam.belongsToMany(db.Teacher, {
  through: db.ExamAssignment,
  foreignKey: 'examId',
  otherKey: 'teacherId',
  as: 'teachers'
});
db.Teacher.belongsToMany(db.Exam, {
  through: db.ExamAssignment,
  foreignKey: 'teacherId',
  otherKey: 'examId',
  as: 'assignedExams'
});

// ExamResults
db.Exam.hasMany(db.ExamResult, { foreignKey: 'examId', as: 'results' });
db.ExamResult.belongsTo(db.Exam, { foreignKey: 'examId', as: 'exam' });

db.Student.hasMany(db.ExamResult, { foreignKey: 'studentId', as: 'examResults' });
db.ExamResult.belongsTo(db.Student, { foreignKey: 'studentId', as: 'student' });

// Sequelize instance
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
