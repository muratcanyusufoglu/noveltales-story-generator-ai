'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Story extends Model {
    static associate(models) {
      Story.belongsTo(models.User, { foreignKey: 'userId' });
      Story.belongsToMany(models.Character, {
        through: 'StoryCharacters',
        foreignKey: 'storyId'
      });
      Story.belongsTo(models.Topic, { foreignKey: 'topicId' });
      Story.belongsTo(models.Timelapse, { foreignKey: 'timeLapse' });
      Story.belongsTo(models.Content, { foreignKey: 'content' });
      Story.belongsTo(models.Location, { foreignKey: 'locationid' }); // Association with Location
    }
  }

  Story.init({
    locationId: {
  type: DataTypes.INTEGER,
  allowNull: true,
  references: {
    model: 'Locations',
    key: 'id'
  },
  onUpdate: 'CASCADE',
  onDelete: 'SET NULL'
},

    characterIds: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true
    },
    characterNames: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true
    },
    topicId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    topicName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    timeLapse: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    timeLapseTime: {
      type: DataTypes.STRING,
      allowNull: true
    },
    content: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    contentText: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    locationid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Locations',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    generatedContent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    header: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isContinues: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Story',
  });

  return Story;
};
