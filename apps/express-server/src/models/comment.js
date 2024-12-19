/* eslint-disable @typescript-eslint/no-require-imports */
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.Post, { foreignKey: 'articleId', as: 'post' });
      Comment.belongsTo(models.User, { foreignKey: 'userId', as: 'author' });
    }
  }

  Comment.init(
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
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Comment',
      tableName: 'Comments',
      timestamps: true,
    }
  );

  return Comment;
};
