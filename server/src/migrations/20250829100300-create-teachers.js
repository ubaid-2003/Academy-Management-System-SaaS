"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("teachers", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      first_name: {
        type: Sequelize.STRING(80),
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING(80),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(120),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      date_of_birth: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      gender: {
        type: Sequelize.ENUM("Male", "Female", "Other"),
        allowNull: true,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      province: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: "Pakistan",
      },
      qualification: {
        type: Sequelize.STRING(120),
        allowNull: true,
      },
      subject_specialization: {
        type: Sequelize.STRING(120),
        allowNull: true,
      },
      date_of_joining: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      employee_id: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      emergency_contact_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      emergency_contact_phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      blood_group: {
        type: Sequelize.STRING(5),
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM(
          "Active",
          "Inactive",
          "Retired",
          "Transferred",
          "Resigned",
          "On Leave"
        ),
        allowNull: false,
        defaultValue: "Active",
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // First remove ENUMs to prevent Postgres/MySQL ENUM issues
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable("teachers", { transaction });
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_teachers_gender";',
        { transaction }
      );
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_teachers_status";',
        { transaction }
      );
    });
  },
};
