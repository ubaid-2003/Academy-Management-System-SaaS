"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("teacher_students", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      teacherId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: "teachers", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      studentId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: "students", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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

    // prevent duplicate teacher-student assignment in same academy
    await queryInterface.addConstraint("teacher_students", {
      fields: ["teacherId", "studentId", "academyId"],
      type: "unique",
      name: "teacher_students_teacherId_studentId_academyId_unique",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("teacher_students");
  },
};
