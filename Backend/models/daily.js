'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Daily extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Daily.belongsTo(models.Topic, { foreignKey: 'topicId' });
    }
  }
  Daily.init({
    dailyId: DataTypes.INTEGER,
    topicId: DataTypes.INTEGER,
    date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Daily',
  });
  return Daily;
};