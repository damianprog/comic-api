'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StoredImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StoredImage.init(
    {
      url: DataTypes.STRING,
      publicId: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: 'stored_images',
      modelName: 'StoredImage',
    }
  );
  return StoredImage;
};
