'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Comic, User }) {
      // define association here
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
