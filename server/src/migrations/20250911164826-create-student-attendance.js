'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('student_attendances', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },

      studentId: {
        type: Sequelize.INTEGER.UNSIGNED, // match students.id
        allowNull: false,
        references: { model: 'students', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      classId: {
        type: Sequelize.INTEGER.UNSIGNED, // match classes.id
        allowNull: false,
        references: { model: 'classes', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      courseId: {
        type: Sequelize.INTEGER.UNSIGNED, // match courses.id
        allowNull: false,
        references: { model: 'courses', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      academyId: {
        type: Sequelize.INTEGER.UNSIGNED, // match academies.id
        allowNull: false,
        references: { model: 'academies', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('student_attendances');
  },
};
