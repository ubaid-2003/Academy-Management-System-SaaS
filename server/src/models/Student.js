'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    static associate(models) {
      Student.belongsTo(models.Academy, {
        foreignKey: 'academyId',
        as: 'academy',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      Student.belongsToMany(models.Teacher, {
        through: models.TeacherStudents,
        foreignKey: 'studentId',
        otherKey: 'teacherId',
        as: 'teachers',
      });

      Student.hasMany(models.TeacherStudents, {
        foreignKey: 'studentId',
        as: 'teacherLinks',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  Student.init(
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true } },
      phone: { type: DataTypes.STRING, allowNull: false },
      dateOfBirth: { type: DataTypes.DATEONLY },
      gender: { type: DataTypes.ENUM('male','female','other') },
      rollNumber: { type: DataTypes.STRING, allowNull: false },
      grade: { type: DataTypes.STRING },
      section: { type: DataTypes.STRING },
      permanentAddress: { type: DataTypes.TEXT },
      currentAddress: { type: DataTypes.TEXT },
      city: { type: DataTypes.STRING },
      province: { type: DataTypes.STRING },
      country: { type: DataTypes.STRING, defaultValue: 'Pakistan' },
      guardianName: { type: DataTypes.STRING, allowNull: false },
      guardianPhone: { type: DataTypes.STRING, allowNull: false },
      guardianRelation: { type: DataTypes.STRING },
      status: { type: DataTypes.ENUM('active','inactive','suspended'), defaultValue: 'active' },
      academyId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    },
    {
      sequelize,
      modelName: 'Student',
      tableName: 'students',
      timestamps: true,
    }
  );

  return Student;
};
