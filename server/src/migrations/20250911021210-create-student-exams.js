'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('student_exams', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      studentId: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
      examId: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
      marks: { type: Sequelize.DECIMAL(5,2), allowNull: true },
      status: { type: Sequelize.ENUM('scheduled','completed','absent'), defaultValue: 'scheduled' },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('student_exams');
  }
};
