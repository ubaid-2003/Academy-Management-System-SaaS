'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserAcademy = sequelize.define(
    'UserAcademy',
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      userId: { 
        type: DataTypes.INTEGER.UNSIGNED, 
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      academyId: { 
        type: DataTypes.INTEGER.UNSIGNED, 
        allowNull: false,
        references: { model: 'academies', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      roleId: { // store roleId instead of string
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'roles', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    },
    {
      tableName: 'user_academies',
      timestamps: true,
    }
  );

  UserAcademy.associate = function (models) {
    UserAcademy.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    UserAcademy.belongsTo(models.Academy, { foreignKey: 'academyId', as: 'academy' });
    UserAcademy.belongsTo(models.Role, { foreignKey: 'roleId', as: 'role' }); // relation to Role table
  };

  return UserAcademy;
};
