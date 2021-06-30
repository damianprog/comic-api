'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserComic extends Model {
    static associate({ Comic, User }) {
      this.belongsTo(Comic, { foreignKey: 'comicId', as: 'comic' });
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    }
  }
  UserComic.init(
    {
      category: DataTypes.STRING,
      comicId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      underscored: true,
      tableName: 'users_comics',
      modelName: 'UserComic',
    }
  );
  return UserComic;
};
