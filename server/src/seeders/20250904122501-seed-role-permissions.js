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
        // SuperAdmin gets all permissions
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
        // Admin gets all permissions except any exclusive SuperAdmin ones
        perms.forEach(p => {
          rolePermissions.push({
            roleId: role.id,
            permissionId: p.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        });
      }

      if (role.name === 'Teacher') {
        const allowed = [
          'view_course', 'assign_teacher', 'view_class',
          'create_exam', 'update_exam', 'view_exam',
          'conduct_exam', 'view_exam_result',
          'view_fee_structures', 'view_fee_payments',
          'create_teacher_attendance', 'update_teacher_attendance', 'view_teacher_attendance'
        ];
        perms.forEach(p => {
          if (allowed.includes(p.name)) {
            rolePermissions.push({
              roleId: role.id,
              permissionId: p.id,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
        });
      }

      if (role.name === 'Student') {
        // Student allowed permissions including their own fee view
        const allowed = [
          'view_course', 'enroll_student',
          'view_exam', 'view_exam_result',
          'view_fee_payments',
          'view_student_attendance'
        ];
        perms.forEach(p => {
          if (allowed.includes(p.name)) {
            rolePermissions.push({
              roleId: role.id,
              permissionId: p.id,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
        });
      }
    });

    if (rolePermissions.length) {
      await queryInterface.bulkInsert('role_permissions', rolePermissions);
      console.log("Role-Permissions seeded successfully.");
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('role_permissions', null, {});
    console.log("Role-Permissions seeder reverted.");
  },
};
