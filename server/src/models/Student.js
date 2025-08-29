'use strict';
module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define(
    'Student',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING(80),
        allowNull: false,
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
      registrationNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Other'),
        allowNull: true,
      },
      class: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      section: {
        type: DataTypes.STRING(20),
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
        allowNull: true,
        defaultValue: 'Pakistan',
      },
      fatherName: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      motherName: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      guardianContact: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      bloodGroup: {
        type: DataTypes.STRING(5),
        allowNull: true,
      },
      enrollmentDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('Active', 'Inactive', 'Graduated', 'Transferred', 'Dropped'),
        defaultValue: 'Active',
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'students',
      timestamps: true,
      underscored: true,
    }
  );

  Student.associate = (models) => {
    // Many-to-Many with Teacher via junction table
    Student.belongsToMany(models.Teacher, {
      through: models.TeacherStudent,
      foreignKey: 'studentId',
      otherKey: 'teacherId',
      as: 'teachers',
    });
  };

  return Student;
};
