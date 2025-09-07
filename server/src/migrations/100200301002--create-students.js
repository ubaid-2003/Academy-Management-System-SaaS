"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("students", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: { type: Sequelize.STRING(255), allowNull: false },
      lastName: { type: Sequelize.STRING(255), allowNull: false },
      email: { type: Sequelize.STRING(255), allowNull: false, unique: true },
      phone: { type: Sequelize.STRING(255), allowNull: false },
      dateOfBirth: { type: Sequelize.DATEONLY, allowNull: false },
      gender: { type: Sequelize.ENUM("male", "female", "other"), allowNull: false },
      rollNumber: { type: Sequelize.STRING(255), allowNull: false, unique: true },
      grade: { type: Sequelize.STRING(255) },
      section: { type: Sequelize.STRING(255) },
      enrollmentDate: { type: Sequelize.DATEONLY },
      bloodGroup: { type: Sequelize.STRING(50) },
      address: { type: Sequelize.TEXT },
      city: { type: Sequelize.STRING(255) },
      province: { type: Sequelize.STRING(255) },
      country: { type: Sequelize.STRING(255), defaultValue: "Pakistan" },
      fatherName: { type: Sequelize.STRING(255) },
      motherName: { type: Sequelize.STRING(255) },
      guardianName: { type: Sequelize.STRING(255), allowNull: false },
      guardianPhone: { type: Sequelize.STRING(255), allowNull: false },
      notes: { type: Sequelize.TEXT },
      status: {
        type: Sequelize.ENUM("active", "inactive", "suspended"),
        defaultValue: "active",
      },
      academyId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: "academies", key: "id" },
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
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("students");
  },
};
