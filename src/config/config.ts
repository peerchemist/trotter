require('dotenv').config();

export default {
    mongoURI: process.env['MONGODB_URL'],
    wallet: process.env['MNEMONIC'],
    adminUsername: process.env['ADMIN_USERNAME'],
    adminPassword: process.env['ADMIN_PASSWORD'],
    nodeEnv: process.env['TROTTER_NODE_ENV'],
    isProductionEnvironment: process.env['TROTTER_NODE_ENV'].trim() === 'production',
    // used for creating a nft api
    // https://github.com/expressjs/multer#limits
    MULTIPART: {
        MAX_FILE_SIZE: parseInt(process.env['MULTIPART_MAX_FILE_SIZE'], 10) || (300 * 1024 * 1024), // 300 MB by default
        MAX_FIELD_LIMIT: parseInt(process.env['MULTIPART_MAX_FIELD_LIMIT'], 10) || 1000,
        MAX_PARTS: parseInt(process.env['MULTIPART_MAX_PARTS'], 10) || 100
    },
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
    listedNetworks: {
        'MATIC_MAINNET': 'erc721',
        // 'ETH_MAINNET',
        'BSC_MAINNET': 'erc721',
        'MATIC_TESTNET': 'erc721',
        'BSC_TESTNET': 'erc721',
        'ETH_TESTNET': 'erc721'
    },
    networkPrefixes: {
        9: 'ETH_MAINNET',
        112: 'MATIC_MAINNET',
        115: 'BSC_MAINNET',
        90: 'ETH_TESTNET',
        1120: 'MATIC_TESTNET',
        1150: 'BSC_TESTNET',
    },
    throttler: {
        ttl: process.env['TTL'],
        limit: process.env['LIMIT'],
    },
    ipfs: {
        pin: process.env['IPFS_PINN'],
        host: process.env['IPFS_HOST'],
        port: process.env['IPFS_PORT'],
        protocol: process.env['IPFS_PROTOCOL']
    },
    db: {
        dialect: process.env['DB_DIALECT'] || 'mongo',
        firestore: {
            defaultCollectionId: process.env['DEFAULT_COLLECTION'] || 'DEFAULT_COLLECTION',
            projectId: process.env['GOOGLE_PROJECT_ID'],
            serviceAccountPath: process.env['GOOGLE_APPLICATION_CREDENTIALS']
        }
    }
}