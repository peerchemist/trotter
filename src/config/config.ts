require('dotenv').config();

export default {
    mongoURI: process.env.MONGODB_URL,
    wallet: process.env.WALLET,
    adminUsername: process.env.ADMIN_USERNAME,
    adminPassword: process.env.ADMIN_PASSWORD,
}