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
    contracts: {
        MATIC_MAINNET: process.env['NFT_CONTRACT_MATIC_MAINNET'],
        ETH_MAINNET: process.env['NFT_CONTRACT_ETH_MAINNET'],
        BSC_MAINNET: process.env['NFT_CONTRACT_BSC_MAINNET'],
        MATIC_TESTNET: process.env['NFT_CONTRACT_MATIC_TESTNET'],
        ETH_TESTNET: process.env['NFT_CONTRACT_ETH_TESTNET'],
        BSC_TESTNET: process.env['NFT_CONTRACT_BSC_TESTNET'],
    },
    listNetworks: [
        'MATIC_MAINNET',
        // 'ETH_MAINNET',
        'BSC_MAINNET',
        'MATIC_TESTNET',
        'BSC_TESTNET',
        'ETH_TESTNET',
    ],
    throttler: {
        ttl: process.env['TTL'],
        limit: process.env['LIMIT'],
    },
    ipfs: {
        pin: process.env['IPFS_PINN'],
        host: process.env['IPFS_HOST'],
        port: process.env['IPFS_PORT']
    }
}