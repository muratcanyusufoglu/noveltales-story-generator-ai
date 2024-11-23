'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Stories', 'isContinues', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Stories', 'isContinues');
  }
};
