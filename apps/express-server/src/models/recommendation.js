/* eslint-disable @typescript-eslint/no-require-imports */
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Recommendation extends Model {
    static associate(models) {
      Recommendation.belongsTo(models.Post, { foreignKey: 'articleId', as: 'post' });
    }
  }

  Recommendation.init(
    {
      articleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Posts',
          key: 'id',
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      recommendedTime: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'Recommendation',
      tableName: 'Recommendations',
      timestamps: true,
    }
  );


  return Recommendation;
};
