'use strict'
const { Model } = require('sequelize')

const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasOne(models.wallet, { foreignKey: 'id', as: 'wallet' })
    }
  }

  user.init(
    {
      // Model attributes are defined here
      id: {
        primaryKey: true,
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        // allowNull defaults to true
      },
      emailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      verifyString: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tokens: {
        type: DataTypes.JSON,
      },
    },
    {
      hooks: {
        beforeCreate: (user, options) => {
          user.id = uuidv4()
        },
        beforeSave: async (user, options) => {
          if (user.changed('password')) {
            const passwordHash = await bcrypt.hash(user.password, 10)
            user.password = passwordHash
          }
        }
      },
      sequelize,
      modelName: 'user',
    }
  )

  return user
}
