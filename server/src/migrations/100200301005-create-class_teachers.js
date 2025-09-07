"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("class_teachers", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      class_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: "classes", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      teacher_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: "teachers", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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

    // Prevent duplicate teacher assignment to the same class
    await queryInterface.addConstraint("class_teachers", {
      fields: ["class_id", "teacher_id"],
      type: "unique",
      name: "uq_class_teacher",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("class_teachers");
  },
};
