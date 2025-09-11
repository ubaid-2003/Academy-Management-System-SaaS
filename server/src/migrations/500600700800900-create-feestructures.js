'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('fee_structures', {
      id: { 
        type: Sequelize.INTEGER.UNSIGNED, 
        autoIncrement: true, 
        primaryKey: true 
      },
      academyId: { // <-- new column
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'academies', key: 'id' }, // reference Academies table
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      classId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'classes', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      tuitionFee: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0, allowNull: false },
      admissionFee: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0, allowNull: false },
      examFee: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0, allowNull: false },
      libraryFee: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0, allowNull: false },
      sportsFee: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0, allowNull: false },
      otherFee: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0, allowNull: false },
      dueDate: { type: Sequelize.DATE, allowNull: false },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      academicYear: { type: Sequelize.STRING, allowNull: false },
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('fee_structures');
  },
};
