'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CourseStudent extends Model {
    static associate(models) {
      // Junction table, no further associations here
    }
  }

  CourseStudent.init({
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Courses', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Students', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'CourseStudent',
    tableName: 'course_students',
  });

  return CourseStudent;
};
