'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate({ Comic, User }) {
      this.belongsTo(Comic, { foreignKey: 'comicId', as: 'comic' });
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    }
  }
  Review.init(
    {
      comicId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      text: DataTypes.STRING,
    },
    {
      sequelize,
      underscored: true,
      tableName: 'reviews',
      modelName: 'Review',
    }
  );
  return Review;
};
