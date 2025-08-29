'use strict';
module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define(
    'Teacher',
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
      dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Other'),
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
      qualification: {
        type: DataTypes.STRING(120),
        allowNull: true,
      },
      subjectSpecialization: {
        type: DataTypes.STRING(120),
        allowNull: true,
      },
      dateOfJoining: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      employeeId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true,
      },
      emergencyContactName: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      emergencyContactPhone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      bloodGroup: {
        type: DataTypes.STRING(5),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('Active', 'Inactive', 'Retired', 'Transferred', 'Resigned'),
        defaultValue: 'Active',
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'teachers',
      timestamps: true,
      underscored: true,
    }
  );

  Teacher.associate = (models) => {
    // Many-to-Many with Student via TeacherStudent
    Teacher.belongsToMany(models.Student, {
      through: models.TeacherStudent,
      foreignKey: 'teacherId',
      otherKey: 'studentId',
      as: 'students',
    });
  };

  return Teacher;
};
