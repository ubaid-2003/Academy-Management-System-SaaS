'use strict';

module.exports = {
  // ✅ Disable automatic transaction
  migrationDisableTransaction: true,

  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('teacher_students', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      teacher_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'teachers', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      student_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'students', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addConstraint('teacher_students', {
      fields: ['teacher_id', 'student_id'],
      type: 'unique',
      name: 'unique_teacher_student_pair',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('teacher_students');
  },
};
