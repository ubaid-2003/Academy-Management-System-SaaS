'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CourseTeacher extends Model {
    static associate(models) {
      // Junction table, no further associations needed here
    }
  }

  CourseTeacher.init({
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Courses', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Teachers', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'CourseTeacher',
    tableName: 'course_teachers',
  });

  return CourseTeacher;
};
