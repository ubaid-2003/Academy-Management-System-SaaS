'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Academies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      name: { type: Sequelize.STRING(100), allowNull: false },
      registrationNumber: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      address: { type: Sequelize.STRING(255), allowNull: false },
      city: { type: Sequelize.STRING(50), allowNull: false },
      province: { type: Sequelize.STRING(50), allowNull: false },
      country: { type: Sequelize.STRING(50), allowNull: false, defaultValue: 'Pakistan' },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      phone: { type: Sequelize.STRING(20), allowNull: false },
      principalName: { type: Sequelize.STRING(100), allowNull: false },
      totalStudents: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
      facilities: { type: Sequelize.TEXT, allowNull: false },
      status: { type: Sequelize.ENUM('Active','Inactive','Pending'), allowNull: false, defaultValue: 'Pending' },
      notes: { type: Sequelize.TEXT, allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Academies');
  }
};
