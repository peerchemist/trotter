require('dotenv').config();

export default {
    mongoURI: process.env.MONGODB_URL,
    wallet: process.env.WALLET
}