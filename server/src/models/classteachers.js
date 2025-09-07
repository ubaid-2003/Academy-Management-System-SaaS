'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ClassTeachers extends Model {
    static associate(models) {
      // Each ClassTeachers record belongs to one Class
      ClassTeachers.belongsTo(models.Class, {
        foreignKey: 'classId',
        as: 'class',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // Each ClassTeachers record belongs to one Teacher
      ClassTeachers.belongsTo(models.Teacher, {
        foreignKey: 'teacherId',
        as: 'teacher',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // No need to call models.Class.hasMany(...) here!
      // The parent models (Class, Teacher) will define hasMany in their own models.
    }
  }

  ClassTeachers.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      classId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'class_id',
      },
      teacherId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'teacher_id',
      },
    },
    {
      sequelize,
      modelName: 'ClassTeachers',
      tableName: 'class_teachers',
      underscored: true,
      timestamps: true,
    }
  );

  return ClassTeachers;
};
