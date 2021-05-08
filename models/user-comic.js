'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserComic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Comic }) {
      // define association here
    }
  }
  UserComic.init(
    {
      type: DataTypes.STRING,
      comicId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: 'users_comics',
      modelName: 'UserComic',
    }
  );
  return UserComic;
};
