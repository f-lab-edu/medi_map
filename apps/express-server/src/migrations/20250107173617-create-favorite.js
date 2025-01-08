'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Favorites', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      medicineId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      itemName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      entpName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      etcOtcName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      className: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      itemImage: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Favorites');
  },
};
