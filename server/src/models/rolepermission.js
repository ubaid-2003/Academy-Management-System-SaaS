'use strict';
module.exports = (sequelize, DataTypes) => {
  const RolePermission = sequelize.define(
    'RolePermission',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      roleId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      permissionId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
    },
    {
      tableName: 'role_permissions',
      timestamps: true,
    }
  );

  RolePermission.associate = function (models) {
    RolePermission.belongsTo(models.Role, { foreignKey: 'roleId', as: 'role' });
    RolePermission.belongsTo(models.Permission, { foreignKey: 'permissionId', as: 'permission' });
  };

  return RolePermission;
};
