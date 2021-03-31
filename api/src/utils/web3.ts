import config from "src/config/config";
const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider')

const provider = new HDWalletProvider(
    config.wallet,
    config.web3Rpc
);

const web3 = new Web3(provider);
export default web3;