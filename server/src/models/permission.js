'use strict';
module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define(
    'Permission',
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
      tableName: 'permissions',
      timestamps: true,
    }
  );

  Permission.associate = function (models) {
    // Permission -> Role (M:N)
    Permission.belongsToMany(models.Role, {
      through: models.RolePermission,
      foreignKey: 'permissionId',
      otherKey: 'roleId',
      as: 'roles',
    });
  };

  return Permission;
};
