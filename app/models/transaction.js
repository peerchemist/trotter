'use strict'
const { Model } = require('sequelize')

const { v4: uuidv4 } = require('uuid')

module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      transaction.belongsTo(models.wallet, { foreignKey: 'walletId', as: 'wallet' })
    }
  }

  transaction.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.STRING,
      },
      walletId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      transactionType: {
        type: DataTypes.ENUM('withdrawal', 'deposit') ,
        allowNull: false,
      },
      previousBalance: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      currentBalance: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
    },
    {
      hooks: {
        beforeCreate: (transaction, options) => {
          transaction.id = uuidv4()
        },
      },
      sequelize,
      modelName: 'transaction',
    }
  )
  
  return transaction
}
