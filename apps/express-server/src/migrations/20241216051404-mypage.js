'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // provider 컬럼 추가
    await queryInterface.addColumn('Users', 'provider', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'credentials', // 기본값 설정
    });

    // providerId 컬럼 추가
    await queryInterface.addColumn('Users', 'providerId', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    // rollback: provider 컬럼 제거
    await queryInterface.removeColumn('Users', 'provider');

    // rollback: providerId 컬럼 제거
    await queryInterface.removeColumn('Users', 'providerId');
  },
};
