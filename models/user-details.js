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
      profileImage: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      backgroundImage: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      profileImagePublicId: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      backgroundImagePublicId: {
        type: DataTypes.STRING,
        defaultValue: '',
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
      underscored: true,
      tableName: 'users_details',
      modelName: 'UserDetails',
    }
  );
  return UserDetails;
};
