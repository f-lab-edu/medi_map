'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MedicineDesc', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      itemSeq: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      itemName: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      itemEngName: {
        type: Sequelize.TEXT,
      },
      indutyType: {
        type: Sequelize.STRING,
      },
      makeMaterialFlag: {
        type: Sequelize.STRING,
      },
      storageMethod: {
        type: Sequelize.TEXT,
      },
      validTerm: {
        type: Sequelize.TEXT,
      },
      packUnit: {
        type: Sequelize.TEXT,
      },
      meterialName: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable('MedicineDesc');
  },
};
