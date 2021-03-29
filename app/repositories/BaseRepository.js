// initialize streams on models
const SequelizeStream = require('node-sequelize-stream')
const sequelize = require('../models').sequelize
SequelizeStream(sequelize)
class BaseRepository {
  constructor(model) {
    this.Model = model
  }

  async save(data) {
    return await this.Model.create(data)
  }

  async update(query, data) {
    return await this.Model.update(data, { where: query })
  }

  async find(query, include = [], attributes) {
    return await this.Model.findOne({ where: query, include, attributes })
  }

  async findAll(query, include = [], attributes) {
    return await this.Model.findAll({ where: query, include, attributes })
  }

  async delete(query) {
    return await this.Model.destroy({ where: query })
  }

  findAllWithStream(query, include = [], attributes) {
    return this.Model.findAllWithStream({
      batchSize: 100,
      where: query,
      include,
      attributes,
    })
  }
}

module.exports = BaseRepository
