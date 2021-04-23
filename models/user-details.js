'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      // define association here
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    }
  }
  UserDetails.init(
    {
      profileStoredImageId: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      backgroundStoredImageId: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      about: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      interests: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: 'users_details',
      modelName: 'UserDetails',
    }
  );
  return UserDetails;
};
