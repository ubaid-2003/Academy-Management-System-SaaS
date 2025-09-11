// migrations/xxxx-create-course-feestructures.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CourseFeeStructures', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      courseId: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'courses', key: 'id' }, onDelete: 'CASCADE' },
      feeStructureId: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'fee_structures', key: 'id' }, onDelete: 'CASCADE' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('CourseFeeStructures');
  }
};
