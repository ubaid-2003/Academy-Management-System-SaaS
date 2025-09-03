'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('teachers', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      firstName: { type: Sequelize.STRING, allowNull: false },
      lastName: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      phone: { type: Sequelize.STRING },
      gender: { type: Sequelize.ENUM('male','female','other') },
      dateOfBirth: { type: Sequelize.DATEONLY },
      employeeId: { type: Sequelize.STRING, allowNull: false, unique: true },
      qualification: { type: Sequelize.STRING },
      experienceYears: { type: Sequelize.INTEGER },
      address: { type: Sequelize.TEXT },
      city: { type: Sequelize.STRING },
      province: { type: Sequelize.STRING },
      country: { type: Sequelize.STRING, defaultValue: 'Pakistan' },
      status: { type: Sequelize.ENUM('active','inactive','suspended'), defaultValue: 'active' },
      subjects: { type: Sequelize.JSON },

      // Foreign Key: Academy
      academyId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'academies', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },

      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('teachers');
  }
};
