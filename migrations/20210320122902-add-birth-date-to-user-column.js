'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('users', 'birthDate', Sequelize.DATE);
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('users', 'birthDate');
  },
};
