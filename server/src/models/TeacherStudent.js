'use strict';
module.exports = (sequelize, DataTypes) => {
  const TeacherStudent = sequelize.define(
    'TeacherStudent',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      teacherId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'teacher_id',
        references: { model: 'teachers', key: 'id' },
        onDelete: 'CASCADE', // ✅ auto delete
        onUpdate: 'CASCADE',
      },
      studentId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'student_id',
        references: { model: 'students', key: 'id' },
        onDelete: 'CASCADE', // ✅ auto delete
        onUpdate: 'CASCADE',
      },
    },
    {
      tableName: 'teacher_students',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['teacher_id', 'student_id'],
        },
      ],
    }
  );

  TeacherStudent.associate = (models) => {
    TeacherStudent.belongsTo(models.Teacher, { foreignKey: 'teacherId', as: 'teacher' });
    TeacherStudent.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
  };

  return TeacherStudent;
};
