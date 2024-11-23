'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Topics', 'images', {
      type: Sequelize.ARRAY(Sequelize.STRING), // This will store image URLs as strings
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Topics', 'images');
  }
};
