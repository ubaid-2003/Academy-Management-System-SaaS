'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserAcademy = sequelize.define(
    'UserAcademy',
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      academyId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      role: { type: DataTypes.STRING, defaultValue: 'Admin' },
    },
    {
      tableName: 'user_academies',
      timestamps: true,
    }
  );

  UserAcademy.associate = function (models) {
    UserAcademy.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    UserAcademy.belongsTo(models.Academy, { foreignKey: 'academyId', as: 'academy' });
  };

  return UserAcademy;
};
