'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Follows extends Model {
    static associate(models) {
      // No additional associations required here for Follows
    }
  }

  Follows.init({
    following_user_id: DataTypes.INTEGER,
    followed_user_id: DataTypes.INTEGER,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Follows',
  });

  return Follows;
};
