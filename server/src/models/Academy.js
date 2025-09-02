'use strict';
module.exports = (sequelize, DataTypes) => {
  const Academy = sequelize.define(
    'Academy',
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      registrationNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      province: DataTypes.STRING,
      country: { type: DataTypes.STRING, defaultValue: 'Pakistan' },
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      principalName: DataTypes.STRING,
      totalStudents: DataTypes.INTEGER.UNSIGNED,
      status: { type: DataTypes.ENUM('Active','Inactive','Pending'), defaultValue: 'Pending' },
      facilities: DataTypes.TEXT,
      notes: DataTypes.TEXT,
    },
    {
      tableName: 'academies',
      timestamps: true,
    }
  );

  Academy.associate = function(models) {
    // Many-to-many with User
    Academy.belongsToMany(models.User, {
      through: models.UserAcademy,
      as: 'users',
      foreignKey: 'academyId',
      otherKey: 'userId',
    });

    // One-to-many with UserAcademy
    Academy.hasMany(models.UserAcademy, { as: 'userAcademies', foreignKey: 'academyId' });
  };

  return Academy;
};
