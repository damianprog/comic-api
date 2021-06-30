'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({ UserDetails, UserComic, Review }) {
      this.hasOne(UserDetails, { foreignKey: 'userId', as: 'userDetails' });
      this.hasMany(UserComic, { foreignKey: 'userId', as: 'userComics' });
      this.hasMany(Review, { foreignKey: 'comicId', as: 'reviews' });
    }
  }
  User.init(
    {
      nickname: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      birthDate: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      underscored: true,
      tableName: 'users',
      modelName: 'User',
    }
  );
  return User;
};
