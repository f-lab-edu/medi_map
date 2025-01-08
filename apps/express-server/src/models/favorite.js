/* eslint-disable @typescript-eslint/no-require-imports */
'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  class Favorite extends Model {
    static associate(models) {
      Favorite.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }

  Favorite.init(
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      medicineId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      itemName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      entpName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      etcOtcName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      className: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      itemImage: {
        type: DataTypes.TEXT,
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
