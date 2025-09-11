'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('fee_payments', { // <-- snake_case table name
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
        references: { model: 'fee_structures', key: 'id' }, // <-- corrected
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      studentFeeStructureId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'student_fee_structures', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      paymentDate: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      dueDate: { type: Sequelize.DATE, allowNull: false },
      paymentMethod: {
        type: Sequelize.ENUM('cash', 'credit_card', 'bank_transfer', 'check', 'online'),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('paid', 'pending', 'overdue'),
        defaultValue: 'pending',
      },
      month: { type: Sequelize.STRING, allowNull: false },
      transactionId: { type: Sequelize.STRING },
      recordedBy: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'users', key: 'id' }, // <-- corrected table name
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      notes: { type: Sequelize.TEXT },
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
    await queryInterface.dropTable('fee_payments'); // <-- match table name
  },
};
