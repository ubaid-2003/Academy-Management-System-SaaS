'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('student_fee_structures', {
      id: { 
        type: Sequelize.INTEGER.UNSIGNED, 
        autoIncrement: true, 
        primaryKey: true 
      },
      studentId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'students', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      feeStructureId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'fee_structures', key: 'id' }, // <-- updated
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      discount: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      scholarship: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      finalAmount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      status: {
        type: Sequelize.ENUM('active', 'completed', 'cancelled'),
        defaultValue: 'active',
      },
      createdAt: { 
        type: Sequelize.DATE, 
        allowNull: false, 
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') 
      },
      updatedAt: { 
        type: Sequelize.DATE, 
        allowNull: false, 
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') 
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('student_fee_structures');
  },
};
