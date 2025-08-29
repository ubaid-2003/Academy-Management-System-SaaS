'use strict';

module.exports = (sequelize, DataTypes) => {
  const Academy = sequelize.define(
    'Academy',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED, // ✅ Unsigned to match FK
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      registrationNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      status: {
        type: DataTypes.STRING(50),
        defaultValue: 'Active',
      },
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      province: DataTypes.STRING,
      country: {
        type: DataTypes.STRING,
        defaultValue: 'Pakistan',
      },
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      principalName: DataTypes.STRING,
      totalStudents: DataTypes.INTEGER,
      totalTeachers: DataTypes.INTEGER,
    },
    {
      tableName: 'Academies',
      timestamps: true,
    }
  );

  Academy.associate = function (models) {
    // Many-to-Many with Users (Admin, Teacher)
    Academy.belongsToMany(models.User, {
      through: models.UserAcademy,
      as: 'users',
      foreignKey: 'academyId',
    });

    // Explicitly define Academy -> UserAcademy
    Academy.hasMany(models.UserAcademy, { foreignKey: 'academyId', as: 'userAcademies' });

    // Academy has many Students
    Academy.hasMany(models.Student, { foreignKey: 'academyId', as: 'students' });

    // Academy has many Teachers
    Academy.hasMany(models.Teacher, { foreignKey: 'academyId', as: 'teachers' });
  };


  return Academy;
};
