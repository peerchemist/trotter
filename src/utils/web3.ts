import config from "src/config/config";
const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider')

const provider = (network: string) => new HDWalletProvider({
    mnemonic: {
        phrase: config.wallet
    },
    providerOrUrl: process.env[network]
});

const web3 = (network: string) => new Web3(provider(network));
export default web3;