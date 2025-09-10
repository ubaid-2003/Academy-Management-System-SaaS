'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('exam_results', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED, // must match exams.id
        primaryKey: true,
        autoIncrement: true,
      },
      examId: {
        type: Sequelize.INTEGER.UNSIGNED, // must match exams.id
        allowNull: false,
        references: { model: 'exams', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      studentId: {
        type: Sequelize.INTEGER.UNSIGNED, // match students.id
        allowNull: false,
        references: { model: 'students', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      marksObtained: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },

    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('exam_results');
  },
};
