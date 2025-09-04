'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      fullName: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      roleId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false }, // FK to Role
    },
    {
      tableName: 'users',
      timestamps: true,
    }
  );

  User.associate = function (models) {
    // Each User belongs to 1 Role
    User.belongsTo(models.Role, { foreignKey: 'roleId', as: 'role' });

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
