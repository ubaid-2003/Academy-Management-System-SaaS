'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('students', 'classId', {
      type: Sequelize.INTEGER.UNSIGNED, // Must match classes.id
      allowNull: true,
      references: {
        model: 'classes', // table name
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('students', 'classId');
  }
};
