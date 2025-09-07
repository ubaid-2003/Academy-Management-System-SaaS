"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    static associate(models) {
      // A Class belongs to an Academy
      Class.belongsTo(models.Academy, {
        foreignKey: "academyId",
        as: "academy",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      // A Class has many Students
      Class.hasMany(models.Student, {
        foreignKey: "classId",
        as: "students",
        onDelete: "SET NULL",
      });

      // A Class has many Teachers (Many-to-Many)
      Class.belongsToMany(models.Teacher, {
        through: models.ClassTeachers, // Junction table
        foreignKey: "classId",
        otherKey: "teacherId",
        as: "teachers",
      });
    }
  }

  Class.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      section: {
        type: DataTypes.STRING, // e.g., A, B, C
        allowNull: true,
      },
      gradeLevel: {
        type: DataTypes.STRING, // e.g., Grade 1, Grade 8
        allowNull: false,
      },
      academicYear: {
        type: DataTypes.STRING, // e.g., 2025-2026
        allowNull: false,
      },
      shift: {
        type: DataTypes.ENUM("Morning", "Evening"),
        allowNull: true, // optional
      },
      medium: {
        type: DataTypes.ENUM("English", "Urdu"),
        allowNull: true, // optional
      },
      capacity: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true, // optional: max students in class
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "active",
      },
    },
    {
      sequelize,
      modelName: "Class",
      tableName: "classes",
      timestamps: true,
    }
  );

  return Class;
};
