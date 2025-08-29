'use strict';
module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define('Teacher', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING },
    qualification: { type: DataTypes.STRING },
    subjectSpecialization: { type: DataTypes.STRING },
    status: { type: DataTypes.ENUM('Active', 'Inactive'), defaultValue: 'Active' },
    academyId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: { model: 'Academies', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  }, {
    tableName: 'teachers',
    timestamps: true,
  });

  Teacher.associate = models => {
    Teacher.belongsToMany(models.Student, {
      through: models.TeacherStudent,
      foreignKey: 'teacherId',
      otherKey: 'studentId',
    });
    Teacher.belongsTo(models.Academy, { foreignKey: 'academyId', as: 'academy' });
  };

  return Teacher;
};
