'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    static associate(models) {
      Teacher.belongsTo(models.Academy, {
        foreignKey: 'academyId',
        as: 'academy',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      Teacher.belongsToMany(models.Student, {
        through: models.TeacherStudents,
        foreignKey: 'teacherId',
        otherKey: 'studentId',
        as: 'students',
      });

      Teacher.hasMany(models.TeacherStudents, {
        foreignKey: 'teacherId',
        as: 'studentLinks',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  Teacher.init(
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true } },
      phone: { type: DataTypes.STRING },
      gender: { type: DataTypes.ENUM('male','female','other') },
      dateOfBirth: { type: DataTypes.DATEONLY },
      employeeId: { type: DataTypes.STRING, allowNull: false },
      qualification: { type: DataTypes.STRING },
      experienceYears: { type: DataTypes.INTEGER },
      address: { type: DataTypes.TEXT },
      city: { type: DataTypes.STRING },
      province: { type: DataTypes.STRING },
      country: { type: DataTypes.STRING, defaultValue: 'Pakistan' },
      status: { type: DataTypes.ENUM('active','inactive','suspended'), defaultValue: 'active' },
      subjects: { type: DataTypes.JSON },
      academyId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    },
    {
      sequelize,
      modelName: 'Teacher',
      tableName: 'teachers',
      timestamps: true,
    }
  );

  return Teacher;
};
