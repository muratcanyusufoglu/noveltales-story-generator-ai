'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Stories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      characterIds: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true
      },
      characterNames: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true
      },
      topicId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Topics',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      topicName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      timeLapse: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Timelapses',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      timeLapseTime: {
        type: Sequelize.STRING,
        allowNull: true
      },
      content: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Contents',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      contentText: {
        type: Sequelize.STRING,
        allowNull: true
      },
      generatedContent: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      header: {
        type: Sequelize.STRING,
        allowNull: true
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
      },
      locationid: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Location',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Stories');
  }
};
