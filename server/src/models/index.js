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

// Import all models dynamically
fs.readdirSync(__dirname)
  .filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Setup associations after all models are loaded
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) db[modelName].associate(db);
});

// Optional: Teacher ↔ Student many-to-many (if you have TeacherStudent model)
if (db.Teacher && db.Student && db.TeacherStudent) {
  db.Teacher.belongsToMany(db.Student, {
    through: db.TeacherStudent,
    foreignKey: 'teacherId',
    otherKey: 'studentId',
  });
  db.Student.belongsToMany(db.Teacher, {
    through: db.TeacherStudent,
    foreignKey: 'studentId',
    otherKey: 'teacherId',
  });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
