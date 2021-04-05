import config from "src/config/config";
const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider')

const provider = new HDWalletProvider({
    mnemonic: {
        phrase: "input engage salon smooth choose buffalo priority february advice crop visit stand"
    },
    providerOrUrl: "http://127.0.0.1:8545",
});

const web3 = new Web3(provider);
export default web3;