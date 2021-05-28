'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ UserDetails, UserComic }) {
      // define association here
      this.hasOne(UserDetails, { foreignKey: 'userId', as: 'userDetails' });
      this.hasMany(UserComic, { foreignKey: 'userId', as: 'userComics' });
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
