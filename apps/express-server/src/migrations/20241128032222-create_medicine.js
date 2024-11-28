'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Medicine', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      itemSeq: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      itemName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      entpName: {
        type: Sequelize.STRING,
      },
      itemPermitDate: {
        type: Sequelize.DATE,
      },
      chart: {
        type: Sequelize.STRING,
      },
      colorClass1: {
        type: Sequelize.STRING,
      },
      className: {
        type: Sequelize.STRING,
      },
      etcOtcName: {
        type: Sequelize.STRING,
      },
      itemImage: {
        type: Sequelize.TEXT,
      },
      formCodeName: {
        type: Sequelize.STRING,
      },
      drugShape: {
        type: Sequelize.STRING,
      },
      lengLong: {
        type: Sequelize.FLOAT,
      },
      lengShort: {
        type: Sequelize.FLOAT,
      },
      thick: {
        type: Sequelize.FLOAT,
      },
      storageMethod: {
        type: Sequelize.STRING,
      },
      validTerm: {
        type: Sequelize.STRING,
      },
      packUnit: {
        type: Sequelize.STRING,
      },
      eeDocData: {
        type: Sequelize.TEXT,
      },
      udDocData: {
        type: Sequelize.TEXT,
      },
      nbDocData: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Medicine');
  },
};
