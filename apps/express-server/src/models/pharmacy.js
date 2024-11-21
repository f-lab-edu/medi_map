/* eslint-disable @typescript-eslint/no-require-imports */
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Pharmacy extends Model {
    static associate(models) {
    }
  }

  Pharmacy.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      dutyName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dutyAddr: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dutyTel1: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      wgs84Lat: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      wgs84Lon: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      dutyTime1s: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dutyTime1c: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dutyTime2s: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dutyTime2c: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dutyTime3s: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dutyTime3c: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dutyTime4s: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dutyTime4c: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dutyTime5s: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dutyTime5c: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dutyTime6s: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dutyTime6c: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dutyTime7s: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dutyTime7c: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      hpid: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Pharmacy',
      tableName: 'Pharmacy',
      timestamps: true,
    }
  );

  return Pharmacy;
};
