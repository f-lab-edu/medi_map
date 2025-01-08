/* eslint-disable @typescript-eslint/no-require-imports */
'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  class Favorite extends Model {
    static associate(models) {
      Favorite.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }

  Favorite.init(
    {
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      medicine_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      item_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      entp_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      etc_otc_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      class_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Favorite',
      tableName: 'Favorites',
      timestamps: true,
    }
  );

  return Favorite;
};
