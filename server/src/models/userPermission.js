'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserPermission = sequelize.define('UserPermission', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    permissionName: { type: DataTypes.STRING, allowNull: false },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    academyId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: { model: 'Academies', key: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    },
  });

  UserPermission.associate = (models) => {
    UserPermission.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    UserPermission.belongsTo(models.Academy, { foreignKey: 'academyId', as: 'academy' });
  };

  return UserPermission;
};
