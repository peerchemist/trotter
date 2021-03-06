require('dotenv').config();

export default {
  mongoURI: process.env['MONGODB_URL'],
  wallet: process.env['MNEMONIC'],
  adminUsername: "test",
  adminPassword: "password",
  nodeEnv: process.env['TROTTER_NODE_ENV'],
  isProductionEnvironment: true,
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
    // 'MATIC_TESTNET',
    // 'BSC_TESTNET',
    'ETH_TESTNET': 'erc721'
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
  }
}