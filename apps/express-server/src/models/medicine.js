/* eslint-disable @typescript-eslint/no-require-imports */
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Medicine extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }

  Medicine.init(
    {
      itemSeq: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      itemName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      entpName: DataTypes.STRING,
      itemPermitDate: DataTypes.DATE,
      chart: DataTypes.STRING,
      colorClass1: DataTypes.STRING,
      className: DataTypes.STRING,
      etcOtcName: DataTypes.STRING,
      itemImage: DataTypes.TEXT,
      formCodeName: DataTypes.STRING,
      drugShape: DataTypes.STRING,
      lengLong: DataTypes.FLOAT,
      lengShort: DataTypes.FLOAT,
      thick: DataTypes.FLOAT,
      storageMethod: DataTypes.STRING,
      validTerm: DataTypes.STRING,
      packUnit: DataTypes.STRING,
      eeDocData: DataTypes.TEXT,
      udDocData: DataTypes.TEXT,
      nbDocData: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Medicine',
      tableName: 'Medicine',
    }
  );

  return Medicine;
};
