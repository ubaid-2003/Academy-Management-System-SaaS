"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ClassStudents extends Model {
    static associate(models) {
      ClassStudents.belongsTo(models.Class, {
        foreignKey: "classId",
        as: "class",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

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
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      classId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: "class_id" },
      studentId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: "student_id" },
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
