'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('comics', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      marvelApiId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      coverImage: {
        type: Sequelize.TEXT,
      },
      onsaleDate: {
        type: Sequelize.DATE,
      },
      writer: {
        type: Sequelize.STRING,
      },
      inker: {
        type: Sequelize.STRING,
      },
      penciler: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      seriesId: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('comics');
  },
};
