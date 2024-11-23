'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    static associate(models) {
      // A Location can be used in many Stories
      Location.hasMany(models.Story, { foreignKey: 'locationId' });
    }
  }

  Location.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    era: {
      type: DataTypes.STRING,
      allowNull: true, // Optional era information (e.g., Medieval, Future)
    },
    climate: {
      type: DataTypes.STRING,
      allowNull: true, // Optional climate information (e.g., Desert, Rainforest)
    },
    geography: {
      type: DataTypes.STRING,
      allowNull: true, // Optional geography information (e.g., Mountainous, Coastal)
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'Location',
  });

  return Location;
};
