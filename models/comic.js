'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Comic.init(
    {
      marvelApiId: DataTypes.INTEGER,
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
      tableName: 'comics',
      modelName: 'Comic',
    }
  );
  return Comic;
};
