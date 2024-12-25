'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('StoryCharacters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      storyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Stories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      characterId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Characters',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Add composite unique constraint
    await queryInterface.addConstraint('StoryCharacters', {
      fields: ['storyId', 'characterId'],
      type: 'unique',
      name: 'unique_story_character'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('StoryCharacters');
  }
}; 