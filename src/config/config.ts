require('dotenv').config();

export default {
    mongoURI: process.env['MONGODB_URL'],
    wallet: process.env['MNEMONIC'],
    adminUsername: process.env['ADMIN_USERNAME'],
    adminPassword: process.env['ADMIN_PASSWORD'],
    nodeEnv: process.env['TROTTER_NODE_ENV']
}