/* eslint-disable @typescript-eslint/no-require-imports */
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Medicine extends Model {
    static associate(models) {
      // MedicineDesc와의 관계 설정
      Medicine.hasOne(models.MedicineDesc, {
        foreignKey: 'itemSeq',
        sourceKey: 'itemSeq',
      });

      // 자기 참조 관계 설정
      Medicine.hasMany(models.Medicine, {
        as: 'RelatedMedicines',
        foreignKey: 'relatedMedicineId',
      });

      Medicine.belongsTo(models.Medicine, {
        as: 'ParentMedicine',
        foreignKey: 'relatedMedicineId',
      });
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
        type: DataTypes.TEXT,
        allowNull: false,
      },
      entpName: DataTypes.STRING,
      itemPermitDate: DataTypes.DATE,
      chart: DataTypes.TEXT,
      colorClass1: DataTypes.STRING,
      className: DataTypes.TEXT,
      etcOtcName: DataTypes.STRING,
      itemImage: DataTypes.TEXT,
      formCodeName: DataTypes.TEXT,
      drugShape: DataTypes.TEXT,
      lengLong: DataTypes.FLOAT,
      lengShort: DataTypes.FLOAT,
      thick: DataTypes.FLOAT,
      relatedMedicineId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Medicine',
      tableName: 'Medicine',
      timestamps: true,
    }
  );

  return Medicine;
};
