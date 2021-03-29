'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transactions', {
      id: {
        primaryKey: true,
        type: Sequelize.STRING
      },
      walletId: {
        type: Sequelize.STRING
      },
      transactionType: {
        type: Sequelize.ENUM('withdrawal', 'deposit') ,
        allowNull: false,
      },
      previousBalance: {
        type: Sequelize.DOUBLE
      },
      currentBalance: {
        type: Sequelize.DOUBLE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('transactions');
  }
};