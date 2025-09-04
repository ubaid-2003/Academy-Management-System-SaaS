'use strict';

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    'Role',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      }
    },
    {
      tableName: 'roles',
      timestamps: true,
    }
  );

  Role.associate = (models) => {
    // many-to-many with Permission via RolePermission (will create later)
    Role.belongsToMany(models.Permission, {
      through: models.RolePermission,
      foreignKey: 'roleId',
      otherKey: 'permissionId',
      as: 'permissions',
    });

    // a Role will have many Users (users.roleId)
    Role.hasMany(models.User, { as: 'users', foreignKey: 'roleId' });
  };

  return Role;
};
