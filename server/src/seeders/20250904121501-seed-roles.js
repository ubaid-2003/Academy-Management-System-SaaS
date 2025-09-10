'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      { name: 'SuperAdmin', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Admin', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Teacher', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Student', createdAt: new Date(), updatedAt: new Date() }
    ], {
      updateOnDuplicate: ['name', 'updatedAt']
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', {
      name: ['SuperAdmin', 'Admin', 'Teacher', 'Student']
    });
  },
};
