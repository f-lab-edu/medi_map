'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        field: 'id',
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'username',
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        field: 'email',
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
        field: 'password',
      },
      googleId: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
        field: 'googleId',
      },
      provider: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'credentials',
        field: 'provider',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        field: 'createdAt',
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        field: 'updatedAt',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  },
};
