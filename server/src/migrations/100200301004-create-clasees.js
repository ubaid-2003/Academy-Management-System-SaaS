'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("classes", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      // Class name, e.g. "Mathematics"
      name: {
        type: Sequelize.STRING(128),
        allowNull: false,
      },

      // Section/group, e.g. A, B
      section: {
        type: Sequelize.STRING(32),
        allowNull: true,
      },

      // Grade level, e.g. "Grade 8"
      gradeLevel: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },

      // Academic year, e.g. "2025-2026"
      academicYear: {
        type: Sequelize.STRING(16),
        allowNull: false,
      },

      // Optional shift
      shift: {
        type: Sequelize.ENUM("Morning", "Evening"),
        allowNull: true,
      },

      // Optional medium
      medium: {
        type: Sequelize.ENUM("English", "Urdu"),
        allowNull: true,
      },

      // Maximum students
      capacity: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
      },

      // Status
      status: {
        type: Sequelize.ENUM("active", "inactive"),
        defaultValue: "active",
        allowNull: false,
      },

      // Academy relationship
      academyId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "academies",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("classes");
  },
};
