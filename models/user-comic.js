'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserComic extends Model {
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
