import config from "src/config/config";
const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider')

const provider = (network?: string) => new HDWalletProvider({
    mnemonic: {
        phrase: config.wallet
    },
    providerOrUrl: (network && process.env[network]) ? process.env[network] : process.env.MATIC_MAINNET
});

const web3 = (network?: string) => new Web3(provider(network));
export default web3;