/* eslint-disable @typescript-eslint/no-require-imports */
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MedicineDesc extends Model {
    static associate(models) {
      MedicineDesc.belongsTo(models.Medicine, {
        foreignKey: 'itemSeq',
        targetKey: 'itemSeq',
      });
    }
  }

  MedicineDesc.init(
    {
      itemSeq: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      itemName: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      itemEngName: DataTypes.TEXT,
      indutyType: DataTypes.STRING,
      makeMaterialFlag: DataTypes.STRING,
      storageMethod: DataTypes.TEXT,
      validTerm: DataTypes.TEXT,
      packUnit: DataTypes.TEXT,
      meterialName: DataTypes.TEXT,
      eeDocData: DataTypes.TEXT,
      udDocData: DataTypes.TEXT,
      nbDocData: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'MedicineDesc',
      tableName: 'MedicineDesc',
      timestamps: true,
    }
  );

  return MedicineDesc;
};
