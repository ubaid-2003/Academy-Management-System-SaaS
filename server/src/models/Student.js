'use strict';
module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING },
    registrationNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    class: { type: DataTypes.STRING },
    section: { type: DataTypes.STRING },
    status: { type: DataTypes.ENUM('Active', 'Inactive'), defaultValue: 'Active' },
    academyId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: { model: 'Academies', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  }, {
    tableName: 'students',
    timestamps: true,
  });

  Student.associate = models => {
    Student.belongsToMany(models.Teacher, {
      through: models.TeacherStudent,
      foreignKey: 'studentId',
      otherKey: 'teacherId',
    });
    Student.belongsTo(models.Academy, { foreignKey: 'academyId', as: 'academy' });
  };

  return Student;
};
