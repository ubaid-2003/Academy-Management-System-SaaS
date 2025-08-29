'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("User", "Admin", "SuperAdmin", "Student", "Teacher"),
      defaultValue: "User",
    },
  }, {
    tableName: 'Users',
    timestamps: true,
  });

  User.associate = function (models) {
    // Many-to-Many with Academy through UserAcademy
    User.belongsToMany(models.Academy, {
      through: models.UserAcademy,
      as: 'academies',         // This alias is used when including academies
      foreignKey: 'userId',
    });

    // Direct relation to UserAcademy for querying role or join table info
    User.hasMany(models.UserAcademy, {
      as: 'userAcademies',     // This alias must match your include in queries
      foreignKey: 'userId',
    });
  };

  return User;
};
