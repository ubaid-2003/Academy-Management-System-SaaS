'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('students', {
      id: { 
        type: Sequelize.INTEGER.UNSIGNED, 
        autoIncrement: true, 
        primaryKey: true 
      },
      firstName: { 
        type: Sequelize.STRING, 
        allowNull: false 
      },
      lastName: { 
        type: Sequelize.STRING, 
        allowNull: false 
      },
      email: { 
        type: Sequelize.STRING, 
        allowNull: false, 
        unique: true 
      },
      phone: { 
        type: Sequelize.STRING, 
        allowNull: false 
      },
      dateOfBirth: { 
        type: Sequelize.DATEONLY 
      },
      gender: { 
        type: Sequelize.ENUM('male','female','other') 
      },
      rollNumber: { 
        type: Sequelize.STRING, 
        allowNull: false, 
        unique: true 
      },
      grade: { 
        type: Sequelize.STRING 
      },
      section: { 
        type: Sequelize.STRING 
      },
      permanentAddress: { 
        type: Sequelize.TEXT 
      },
      currentAddress: { 
        type: Sequelize.TEXT 
      },
      city: { 
        type: Sequelize.STRING 
      },
      province: { 
        type: Sequelize.STRING 
      },
      country: { 
        type: Sequelize.STRING, 
        defaultValue: 'Pakistan' 
      },
      guardianName: { 
        type: Sequelize.STRING, 
        allowNull: false 
      },
      guardianPhone: { 
        type: Sequelize.STRING, 
        allowNull: false 
      },
      guardianRelation: { 
        type: Sequelize.STRING 
      },
      status: { 
        type: Sequelize.ENUM('active','inactive','suspended'), 
        defaultValue: 'active' 
      },

      // Foreign Key: Academy
      academyId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'academies', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },

      createdAt: { 
        type: Sequelize.DATE, 
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') 
      },
      updatedAt: { 
        type: Sequelize.DATE, 
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') 
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('students');
  }
};
