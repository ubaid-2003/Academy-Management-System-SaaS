'use strict';

module.exports = (sequelize, DataTypes) => {
  const Academy = sequelize.define(
    'Academy',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED, // Unsigned to match FK
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
        unique: true, // Only one unique index
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
      tableName: 'academies', // use lowercase for table name to match convention
      timestamps: true,
    }
  );

  Academy.associate = function (models) {
    // Academy has many Students
    Academy.hasMany(models.Student, { foreignKey: 'academyId', as: 'students', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

    // Academy has many Teachers
    Academy.hasMany(models.Teacher, { foreignKey: 'academyId', as: 'teachers', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

    // Academy belongs to many Users via UserAcademy
    Academy.belongsToMany(models.User, {
      through: models.UserAcademy,
      as: 'users',
      foreignKey: 'academyId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // Explicit UserAcademy relation
    Academy.hasMany(models.UserAcademy, { foreignKey: 'academyId', as: 'userAcademies', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  };

  return Academy;
};
