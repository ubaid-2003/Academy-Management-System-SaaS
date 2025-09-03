'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('academies', {
      id: { 
        allowNull: false, 
        autoIncrement: true, 
        primaryKey: true, 
        type: Sequelize.INTEGER.UNSIGNED 
      },
      name: { type: Sequelize.STRING, allowNull: false },
      registrationNumber: { type: Sequelize.STRING, allowNull: false, unique: true },
      address: Sequelize.STRING,
      city: Sequelize.STRING,
      province: Sequelize.STRING,
      country: { type: Sequelize.STRING, defaultValue: 'Pakistan' },
      email: Sequelize.STRING,
      phone: Sequelize.STRING,
      principalName: Sequelize.STRING,
      totalStudents: Sequelize.INTEGER.UNSIGNED,
      status: { type: Sequelize.ENUM("Active","Inactive","Pending"), defaultValue: "Pending" },
      facilities: Sequelize.TEXT,
      notes: Sequelize.TEXT,
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('academies');
  }
};
