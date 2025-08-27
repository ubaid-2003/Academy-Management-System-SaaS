'use strict';

module.exports = (sequelize, DataTypes) => {
  const Academy = sequelize.define(
    'Academy',
    {
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
      country: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      principalName: DataTypes.STRING,
      totalStudents: DataTypes.INTEGER,
      totalTeachers: DataTypes.INTEGER,
    },
    {
      tableName: 'Academies', // make sure it matches your DB table
      timestamps: true,
    }
  );

  Academy.associate = function (models) {
    // Many-to-Many with User
    Academy.belongsToMany(models.User, {
      through: models.UserAcademy,
      as: 'users',
      foreignKey: 'academyId',
    });

    // Direct relation to UserAcademy for querying role
    Academy.hasMany(models.UserAcademy, {
      as: 'userAcademies',
      foreignKey: 'academyId',
    });
  };

  return Academy;
};
