'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      { name: 'SuperAdmin',  },
      { name: 'Admin', },
      { name: 'Teacher', },
      { name: 'Student', }
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
