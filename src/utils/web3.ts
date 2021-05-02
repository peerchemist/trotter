import config from "src/config/config";
const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider')

const provider = (network: string) => {
    const prodviderObj = new HDWalletProvider({
        mnemonic: {
            phrase: config.wallet
        },
        providerOrUrl: config.networks[network]
    });
    prodviderObj.engine.stop();

    return prodviderObj;
}

const web3 = (network: string) => new Web3(provider(network));
export default web3;