const BaseRepository = require('./BaseRepository')
const User = require('../models').user
const Wallet = require('../models').wallet

const { sendWelcomeEmail } = require('../emails/mailer')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { makeid } = require('../libs/helperFunctions')
class UserRepository {
    static async generateAuthToken(user) {
        const token = jwt.sign(
            { id: user.id.toString() },
            process.env.JWT_SECRET
        )

        const tokens = user.tokens ? JSON.parse(user.tokens) : {}
        tokens[token] = true
        user.tokens = JSON.stringify(tokens)
        await user.save()

        return token
    }

    static async create(data) {
        const userModel = new BaseRepository(User)
        const userExists = await userModel.find({ email: data.email })
        if (userExists) {
            throw new Error('User with email already exits!!')
        }

        // create email verification string
        const verifyString = makeid(7)

        data.verifyString = verifyString
        const createUser = await userModel.save(data)
        const token = await this.generateAuthToken(createUser)
        const user = createUser.toJSON()
        // create wallet for user
        const walletModel = new BaseRepository(Wallet)
        const userWalletData = {
            userId: user.id,
            ledger_balance: 0.0,
            available_balance: 0.0
        }

        const userWallet = await walletModel.save(userWalletData)
        user.wallet = userWallet

        // send verification email
        sendWelcomeEmail({
            name: 'Chris',
            email: 'itzchristar@gmail.com',
            verifyString
        })

        delete user.tokens
        delete user.password

        return { user, token }
    }

    static async login(data) {
        if (!data.email || !data.password) {
            throw new Error('Invalid user credentials')
        }

        const userModel = new BaseRepository(User)
        const user = await userModel.find({ email: data.email }, ['wallet'])

        if (!user) {
            throw new Error('Invalid user credentials')
        }

        const isMatch = await bcrypt.compare(data.password, user.password)
        if (!isMatch) {
            throw new Error('Invalid user credentials')
        }

        const token = await this.generateAuthToken(user)
        delete user.dataValues.tokens
        delete user.dataValues.password
        return { user, token }
    }

    static async findAll(query) {
        const userModel = new BaseRepository(User)
        const users = await userModel.findAll(query, ['wallet'], {
            exclude: ['tokens', 'password']
        })

        return users
    }

    static async find(query) {
        if (!query.id) {
            throw new Error('User id is required!!')
        }

        const userModel = new BaseRepository(User)
        const user = await userModel.find(query, ['wallet'], {
            exclude: ['tokens', 'password']
        })

        if (!user) {
            return res.status(404).send(response('User not found!!', user))
        }

        return user
    }
}

module.exports = UserRepository
