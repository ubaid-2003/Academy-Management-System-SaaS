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
  });

  User.associate = function (models) {
    User.belongsToMany(models.Academy, {
      through: models.UserAcademy,
      as: 'academies',
      foreignKey: 'userId',
    });

    // Direct relation to UserAcademy for querying role
    User.hasMany(models.UserAcademy, {
      as: 'userAcademies',
      foreignKey: 'userId',
    });
  };


  return User;
};
