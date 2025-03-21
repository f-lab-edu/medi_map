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
        type: Sequelize.TEXT,
        allowNull: false,
      },
      entpName: {
        type: Sequelize.STRING,
      },
      itemPermitDate: {
        type: Sequelize.DATE,
      },
      chart: {
        type: Sequelize.TEXT,
      },
      colorClass1: {
        type: Sequelize.STRING,
      },
      className: {
        type: Sequelize.TEXT,
      },
      etcOtcName: {
        type: Sequelize.STRING,
      },
      itemImage: {
        type: Sequelize.TEXT,
      },
      formCodeName: {
        type: Sequelize.TEXT,
      },
      drugShape: {
        type: Sequelize.TEXT,
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
