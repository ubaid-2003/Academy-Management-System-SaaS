"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ClassTeachers extends Model {
    static associate(models) {
      // A record belongs to one Class
      ClassTeachers.belongsTo(models.Class, {
        foreignKey: "classId",
        as: "class",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      // A record belongs to one Teacher
      ClassTeachers.belongsTo(models.Teacher, {
        foreignKey: "teacherId",
        as: "teacher",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
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
        field: "class_id",
      },
      teacherId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: "teacher_id",
      },
    },
    {
      sequelize,
      modelName: "ClassTeachers",
      tableName: "class_teachers",
      underscored: true,
      timestamps: true,
    }
  );

  return ClassTeachers;
};
