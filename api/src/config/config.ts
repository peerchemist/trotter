require('dotenv').config();

export default {
    mongoURI: process.env.MONGODB_URL,
    web3Rpc: process.env.WEB3RPC,
    wallet: process.env.WALLET
}