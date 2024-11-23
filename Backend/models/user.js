'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // One-to-many with Post (a user can have many posts)
      User.hasMany(models.Post, { foreignKey: 'userId' });

      // One-to-many with Story (a user can create multiple stories)
      User.hasMany(models.Story, { foreignKey: 'userId' });

      // Self-referencing many-to-many for Follow feature
      User.belongsToMany(models.User, {
        as: 'Followers',
        through: models.Follows, // The junction table
        foreignKey: 'followed_user_id',
      });

      User.belongsToMany(models.User, {
        as: 'Following',
        through: models.Follows,
        foreignKey: 'following_user_id',
      });
    }
  }

  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    role: DataTypes.STRING,
    premium: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
