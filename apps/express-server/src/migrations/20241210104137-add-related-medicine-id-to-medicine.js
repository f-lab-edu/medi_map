'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Medicine', 'relatedMedicineId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Medicine',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Medicine', 'relatedMedicineId');
  },
};
