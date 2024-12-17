'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'provider', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'credentials',
    });

    await queryInterface.addColumn('Users', 'providerId', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Users', 'provider');
    await queryInterface.removeColumn('Users', 'providerId');
  },
};
