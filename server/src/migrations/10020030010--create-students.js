'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('students', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      firstName: { type: Sequelize.STRING, allowNull: false },
      lastName: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, validate: { isEmail: true } },
      phone: { type: DataTypes.STRING },
      dateOfBirth: { type: Sequelize.DATEONLY },
      gender: { type: Sequelize.ENUM('male', 'female', 'other') },
      rollNumber: { type: Sequelize.STRING, allowNull: false },
      grade: { type: Sequelize.STRING },
      section: { type: Sequelize.STRING },
      permanentAddress: { type: Sequelize.TEXT },
      currentAddress: { type: Sequelize.TEXT },
      city: { type: Sequelize.STRING },
      province: { type: Sequelize.STRING },
      country: { type: Sequelize.STRING, defaultValue: 'Pakistan' },
      guardianName: { type: Sequelize.STRING, allowNull: false },
      guardianPhone: { type: Sequelize.STRING, allowNull: false },
      guardianRelation: { type: Sequelize.STRING },
      status: { type: Sequelize.ENUM('active', 'inactive', 'suspended'), defaultValue: 'active' },

      academyId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'academies', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('students');
  },
};
