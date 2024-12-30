/* eslint-disable @typescript-eslint/no-require-imports, no-inline-comments */
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Define associations here
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: 'id',
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'username',
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'email',
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'password',
      },
      googleId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        field: 'googleId',
      },
      provider: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'credentials',
        field: 'provider',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'createdAt',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updatedAt',
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      timestamps: true,
    }
  );

  return User;
};
