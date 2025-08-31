"use strict";

module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define(
    "Teacher",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: DataTypes.STRING(80),
        allowNull: false,
        field: "first_name",
      },
      lastName: {
        type: DataTypes.STRING(80),
        allowNull: false,
        field: "last_name",
      },
      email: {
        type: DataTypes.STRING(120),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "date_of_birth",
      },
      gender: {
        type: DataTypes.ENUM("Male", "Female", "Other"),
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      province: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "Pakistan",
      },
      qualification: {
        type: DataTypes.STRING(120),
        allowNull: true,
      },
      subjectSpecialization: {
        type: DataTypes.STRING(120),
        allowNull: true,
        field: "subject_specialization",
      },
      dateOfJoining: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "date_of_joining",
      },
      employeeId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: "employee_id",
      },
      emergencyContactName: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "emergency_contact_name",
      },
      emergencyContactPhone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: "emergency_contact_phone",
      },
      bloodGroup: {
        type: DataTypes.STRING(5),
        allowNull: true,
        field: "blood_group",
      },
      status: {
        type: DataTypes.ENUM(
          "Active",
          "Inactive",
          "Retired",
          "Transferred",
          "Resigned",
          "On Leave"
        ),
        allowNull: false,
        defaultValue: "Active",
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "teachers",
      timestamps: true,
      underscored: true, // converts camelCase → snake_case in DB
    }
  );

  Teacher.associate = (models) => {
    // Many-to-Many with Student via TeacherStudent
    Teacher.belongsToMany(models.Student, {
      through: models.TeacherStudent,
      foreignKey: "teacher_id",
      otherKey: "student_id",
      as: "students",
    });
  };

  return Teacher;
};
