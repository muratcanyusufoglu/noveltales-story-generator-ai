'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
  // A post belongs to a user
  Post.belongsTo(models.User, { foreignKey: 'userId' });

  // A post belongs to a story
  Post.belongsTo(models.Story, { foreignKey: 'storyId' });    }
  }
  Post.init({
    userId: DataTypes.INTEGER,
    status: DataTypes.STRING,
    storyId: DataTypes.INTEGER,
    createdAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};