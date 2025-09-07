'use strict';

const permissionsObj = require('../contents/permissions');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissionData = Object.values(permissionsObj).map(name => ({
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('permissions', permissionData, {
      updateOnDuplicate: ['name', 'updatedAt'],
    });

  },

  down: async (queryInterface, Sequelize) => {
    // Convert object values to array before deleting
    await queryInterface.bulkDelete('permissions', {
      name: Object.values(permissionsObj),
    });
  },
};
