"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("users", "status", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "ativo", // valor padrão
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "status");
  },
};
