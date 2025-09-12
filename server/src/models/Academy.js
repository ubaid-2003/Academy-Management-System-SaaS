'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Academy extends Model {
    static associate(models) {
      // Many-to-many with User
      Academy.belongsToMany(models.User, {
        through: models.UserAcademy,
        as: 'users',
        foreignKey: 'academyId',
        otherKey: 'userId',
      });

      // One-to-many with UserAcademy
      Academy.hasMany(models.UserAcademy, { as: 'userAcademies', foreignKey: 'academyId' });

      Academy.hasMany(models.Student, { foreignKey: "academyId", as: "students" });
      Academy.hasMany(models.Teacher, { foreignKey: "academyId", as: "teachers" });

      Academy.hasMany(models.TeacherAttendance, { foreignKey: 'academyId', as: 'teacherAttendances' });
      Academy.hasMany(models.StudentAttendance, { foreignKey: 'academyId', as: 'studentAttendances' });

    }
  }

  Academy.init(
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      registrationNumber: { type: DataTypes.STRING, allowNull: false },
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      province: DataTypes.STRING,
      country: { type: DataTypes.STRING, defaultValue: 'Pakistan' },
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      principalName: DataTypes.STRING,
      totalStudents: {
        type: DataTypes.INTEGER,
        defaultValue: 0,   // ✅ jab create hoga to 0
      },
      totalTeachers: {
        type: DataTypes.INTEGER,
        defaultValue: 0,   // ✅ jab create hoga to 0
      },
      status: { type: DataTypes.ENUM('Active', 'Inactive', 'Pending'), defaultValue: 'Pending' },
      facilities: DataTypes.TEXT,
      notes: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Academy',
      tableName: 'academies',
      timestamps: true,
    }
  );

  return Academy;
};
