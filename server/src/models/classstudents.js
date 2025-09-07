"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ClassStudents extends Model {
    static associate(models) {
      // A record belongs to one Class
      ClassStudents.belongsTo(models.Class, {
        foreignKey: "classId",
        as: "class",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      // A record belongs to one Student
      ClassStudents.belongsTo(models.Student, {
        foreignKey: "studentId",
        as: "student",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  ClassStudents.init(
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
      studentId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: "student_id",
      },
    },
    {
      sequelize,
      modelName: "ClassStudents",
      tableName: "class_students",
      underscored: true,
      timestamps: true,
    }
  );

  return ClassStudents;
};
