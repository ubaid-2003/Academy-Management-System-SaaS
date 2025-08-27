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
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      registrationNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      address: Sequelize.STRING,
      city: Sequelize.STRING,
      province: Sequelize.STRING,
      country: Sequelize.STRING,
      email: Sequelize.STRING,
      phone: Sequelize.STRING,
      principalName: Sequelize.STRING,
      totalStudents: Sequelize.INTEGER,
      totalTeachers: Sequelize.INTEGER,
      status: {
        type: Sequelize.ENUM("Active", "Inactive", "Pending"),
        defaultValue: "Pending"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Academies');
  }
};
'use strict';