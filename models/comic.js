'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comic extends Model {
    static associate({ UserComic, Review }) {
      this.hasMany(UserComic, { foreignKey: 'comicId', as: 'userComics' });
      this.hasMany(Review, { foreignKey: 'comicId', as: 'reviews' });
    }
  }
  Comic.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      title: DataTypes.STRING,
      coverImage: DataTypes.TEXT,
      onsaleDate: DataTypes.DATE,
      writer: DataTypes.STRING,
      inker: DataTypes.STRING,
      penciler: DataTypes.STRING,
      description: DataTypes.TEXT,
      seriesId: DataTypes.INTEGER,
    },
    {
      sequelize,
      underscored: true,
      tableName: 'comics',
      modelName: 'Comic',
    }
  );
  return Comic;
};
