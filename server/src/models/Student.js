'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    static associate(models) {
      // Student belongs to Academy
      Student.belongsTo(models.Academy, {
        foreignKey: 'academyId',
        as: 'academy',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // Student belongs to one Teacher (direct relation)
      Student.belongsTo(models.Teacher, {
        foreignKey: 'teacherId',
        as: 'teacher',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // Many-to-many with Teacher through TeacherStudents
      Student.belongsToMany(models.Teacher, {
        through: models.TeacherStudents,
        foreignKey: 'studentId',
        otherKey: 'teacherId',
        as: 'teachers'
      });

      // Junction table one-to-many (optional, for auditing)
      Student.hasMany(models.TeacherStudents, {
        foreignKey: 'studentId',
        as: 'teacherLinks',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }

  Student.init(
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
      phone: { type: DataTypes.STRING, allowNull: false },
      dateOfBirth: { type: DataTypes.DATEONLY },
      gender: { type: DataTypes.ENUM('male','female','other') },
      rollNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
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
      modelName: 'Student',
      tableName: 'students',
      timestamps: true,
    }
  );

  return Student;
};
