'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Topic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Topic.hasMany(models.Story, { foreignKey: 'topicId' });
      Topic.hasOne(models.Daily, { foreignKey: 'topicId' });
    }
  }

  Topic.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING), // Array of URLs to store images
      allowNull: true, // Allow this field to be null
    },
  }, {
    sequelize,
    modelName: 'Topic',
  });

  return Topic;
};
