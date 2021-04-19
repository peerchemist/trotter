require('dotenv').config();

export default {
    mongoURI: process.env['MONGODB_URL'],
    wallet: process.env['MNEMONIC'],
    adminUsername: process.env['ADMIN_USERNAME'],
    adminPassword: process.env['ADMIN_PASSWORD'],
    nodeEnv: process.env['TROTTER_NODE_ENV'],
    networks: {
        MATIC_MAINNET: process.env['API_MATIC_MAINNET'],
        ETH_MAINNET: process.env['API_ETH_MAINNET'],
        BSC_MAINNET: process.env['API_BSC_MAINNET'],
        MATIC_TESTNET: process.env['API_MATIC_TESTNET'],
        ETH_TESTNET: process.env['API_ETH_TESTNET'],
        BSC_TESTNET: process.env['API_BSC_TESTNET'],
        DEFAULT_NETWORK: process.env['API_DEFAULT_NETWORK'],
    },
    listNetworks: [
        // 'MATIC_MAINNET',
        // 'ETH_MAINNET',
        'BSC_MAINNET',
        'MATIC_TESTNET',
        'ETH_TESTNET',
        'BSC_TESTNET'
    ]
}