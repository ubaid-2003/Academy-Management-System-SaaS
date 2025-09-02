'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      fullName: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.ENUM('User', 'Admin', 'SuperAdmin', 'Student', 'Teacher'), defaultValue: 'Student' },
    },
    {
      tableName: 'users',
      timestamps: true,
    }
  );

  User.associate = function (models) {
    // Many-to-many with Academy
    User.belongsToMany(models.Academy, {
      through: models.UserAcademy,
      as: 'academies',
      foreignKey: 'userId',
      otherKey: 'academyId',
    });

    // One-to-many with UserAcademy
    User.hasMany(models.UserAcademy, { as: 'userAcademies', foreignKey: 'userId' });
  };

  return User;
};
