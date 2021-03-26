'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('Users', 'login', 'nickname');
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('Users', 'nickname', 'login');
  },
};
