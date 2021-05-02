declare const _default: {
    mongoURI: string;
    wallet: string;
    adminUsername: string;
    adminPassword: string;
    nodeEnv: string;
    networks: {
        MATIC_MAINNET: string;
        ETH_MAINNET: string;
        BSC_MAINNET: string;
        MATIC_TESTNET: string;
        ETH_TESTNET: string;
        BSC_TESTNET: string;
        DEFAULT_NETWORK: string;
    };
    contracts: {
        MATIC_MAINNET: string;
        ETH_MAINNET: string;
        BSC_MAINNET: string;
        MATIC_TESTNET: string;
        ETH_TESTNET: string;
        BSC_TESTNET: string;
    };
    listedNetworks: {
        ETH_TESTNET: string;
    };
    throttler: {
        ttl: string;
        limit: string;
    };
    ipfs: {
        pin: string;
        host: string;
        port: string;
        protocol: string;
    };
};
export default _default;
