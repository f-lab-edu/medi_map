'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pharmacy', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      dutyName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dutyAddr: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dutyTel1: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      wgs84Lat: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      wgs84Lon: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      dutyTime1s: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      dutyTime1c: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      dutyTime2s: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      dutyTime2c: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      dutyTime3s: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      dutyTime3c: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      dutyTime4s: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      dutyTime4c: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      dutyTime5s: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      dutyTime5c: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      dutyTime6s: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      dutyTime6c: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      dutyTime7s: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      dutyTime7c: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      hpid: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.dropTable('Pharmacy');
  },
};
