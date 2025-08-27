'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserAcademy extends Model {
    static associate(models) {
      // Use aliases to reference in queries
      UserAcademy.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      UserAcademy.belongsTo(models.Academy, { foreignKey: 'academyId', as: 'academy' });
    }
  }

  UserAcademy.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      academyId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'Member',
      },
    },
    {
      sequelize,
      modelName: 'UserAcademy',
      tableName: 'UserAcademies',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['userId', 'academyId'],
        },
      ],
    }
  );

  return UserAcademy;
};
