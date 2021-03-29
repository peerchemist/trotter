const UserRepository = require('../repositories/UserRepository')

const response = require('../libs/response')

class UserContoller {
  static async create(req, res) {
    try {
      const result = await UserRepository.create(req.query)
      return res.status(201).send(response('User created successfully', result))
    } catch (error) {
      return res.status(400).send(response(error.message, {}, false))
    }
  }

  static async login(req, res) {
    try {
      const result = await UserRepository.login(req.query)
      return res.status(200).send(response('Login was successful', result))
    } catch (error) {
      return res.status(401).send(response(error.message, {}, false))
    }
  }

  static async findAll(req, res) {
    try {
      const result = await UserRepository.findAll(req.query)
      return res.status(200).send(response('Fechted users successfully', result))
    } catch (error) {
      return res.status(400).send(response(error.message, {}, false))
    }
  }

  static async findOne(req, res) {
    try {
      const user = await UserRepository.find(req.query.id)
      return res.status(200).send(response('Fechted user successfully', user))
    } catch (error) {
      return res.status(400).send(response(error.message, {}, false))
    }
  }

  static async update(req, res) {
    try {
      const result = await UserRepository.update(req.query.userId, req.query)
      return res.status(200).send(response('User updated', result))
    } catch (error) {
      return res.status(400).send(response(error.message, {}, false))
    }
  }

  static async delete(req, res) {
    try {
      const result = await UserRepository.delete(req.params.userId)
      return res.status(200).send(response('User deleted', result))
    } catch (error) {
      return res.status(400).send(response(error.message, {}, false))
    }
  }
}

module.exports = UserContoller
