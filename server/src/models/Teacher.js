'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    static associate(models) {
      // Teacher belongs to Academy
      Teacher.belongsTo(models.Academy, {
        foreignKey: 'academyId',
        as: 'academy',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // Optional reference to a single Student (like a primary link)
      Teacher.belongsTo(models.Student, {
        foreignKey: 'primaryStudentId',
        as: 'primaryStudent',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });

      // Many-to-many with Students through TeacherStudents
      Teacher.belongsToMany(models.Student, {
        through: models.TeacherStudents,
        foreignKey: 'teacherId',
        otherKey: 'studentId',
        as: 'students'
      });

      // Junction table one-to-many (optional, auditing)
      Teacher.hasMany(models.TeacherStudents, {
        foreignKey: 'teacherId',
        as: 'studentLinks',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }

  Teacher.init(
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
      phone: { type: DataTypes.STRING },
      gender: { type: DataTypes.ENUM('male', 'female', 'other') },
      dateOfBirth: { type: DataTypes.DATEONLY },
      employeeId: { type: DataTypes.STRING, allowNull: false, unique: true },
      qualification: { type: DataTypes.STRING },
      experienceYears: { type: DataTypes.INTEGER },
      address: { type: DataTypes.TEXT },
      city: { type: DataTypes.STRING },
      province: { type: DataTypes.STRING },
      country: { type: DataTypes.STRING, defaultValue: 'Pakistan' },
      status: { type: DataTypes.ENUM('active', 'inactive', 'suspended'), defaultValue: 'active' },
      subjects: { type: DataTypes.JSON },

      // Foreign Key: Academy
      academyId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'academies', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
    },
    {
      sequelize,
      modelName: 'Teacher',
      tableName: 'teachers',
      timestamps: true
    }
  );

  return Teacher;
};
