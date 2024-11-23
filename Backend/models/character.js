'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Character extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        Character.belongsToMany(models.Story, {
          through: 'StoryCharacters', // Junction table for many-to-many
          foreignKey: 'characterId',
        });
    }
  }
  Character.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Character',
  });
  return Character;
};