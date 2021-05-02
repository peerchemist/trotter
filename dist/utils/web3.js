"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config/config");
const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const provider = (network) => new HDWalletProvider({
    mnemonic: {
        phrase: config_1.default.wallet
    },
    providerOrUrl: config_1.default.networks[network]
});
const web3 = (network) => new Web3(provider(network));
exports.default = web3;
//# sourceMappingURL=web3.js.map