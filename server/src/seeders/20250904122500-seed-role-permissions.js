'use strict';
const permissions = require('../contents/permissions');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [roles] = await queryInterface.sequelize.query(`SELECT id, name FROM roles;`);
    const [perms] = await queryInterface.sequelize.query(`SELECT id, name FROM permissions;`);

    if (!roles.length || !perms.length) {
      console.log("Roles or permissions table is empty. Skipping seeder.");
      return;
    }

    const rolePermissions = [];

    roles.forEach(role => {
      if (role.name === 'SuperAdmin') {
        perms.forEach(p => {
          rolePermissions.push({
            roleId: role.id,
            permissionId: p.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        });
      }

      if (role.name === 'Admin') {
        const perm = perms.find(p => p.name === permissions.CREATE_ACADEMY);
        if (perm) {
          rolePermissions.push({
            roleId: role.id,
            permissionId: perm.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
    });

    if (rolePermissions.length) {
      await queryInterface.bulkInsert('role_permissions', rolePermissions);
    } else {
      console.log("No role-permission pairs to insert.");
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('role_permissions', null, {});
  },
};
