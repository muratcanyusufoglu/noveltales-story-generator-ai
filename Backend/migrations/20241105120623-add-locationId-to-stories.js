'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Stories', 'locationId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Locations', // Ensure this matches your Locations table
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Stories', 'locationId');
  }
};
