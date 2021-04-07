const HDWalletProvider = require('@truffle/hdwallet-provider')
const fs = require('fs')
const mnemonic = fs.readFileSync('.secret').toString().trim()
require('dotenv').config()

module.exports = {
    // Uncommenting the defaults below
    // provides for an easier quick-start with Ganache.
    // You can also follow this format for other networks;
    // see <http://truffleframework.com/docs/advanced/configuration>
    // for more details on how to specify configuration options!
    //
    networks: {
        development: {
            host: '127.0.0.1',
            port: 8545,
            network_id: '*',
        },
        bsctest: {
            provider: () =>
                new HDWalletProvider(
                    mnemonic,
                    `https://data-seed-prebsc-1-s1.binance.org:8545`
                ),
            network_id: 97,
            confirmations: 10,
            timeoutBlocks: 200,
            skipDryRun: true,
        },
        bsc: {
            provider: () =>
                new HDWalletProvider(
                    mnemonic,
                    `https://bsc-dataseed.binance.org`
                ),
            network_id: 56,
            // confirmations: 10,
            timeoutBlocks: 200,
            skipDryRun: true,
            gasPrice: 30000000,
            // gasPrice:  30000000
        },
        matictestnet: {
            provider: () =>
                new HDWalletProvider(
                    mnemonic,
                    `https://rpc-mumbai.maticvigil.com`
                ),
                network_id: 80001,
                skipDryRun: true,
                timeoutBlocks: 200,
        },
        rinkedby: {
            provider: () =>
                new HDWalletProvider(
                    mnemonic,
                    `https://rinkeby.infura.io/v3/${process.env.rinkedbyKey}`
                ),
            network_id: 4,
            skipDryRun: true,
            timeoutBlocks: 200,
        },
    },
    compilers: {
        solc: {
            version: '0.8.0',
            settings: {
                //     // See the solidity docs for advice about optimization and evmVersion
                optimizer: {
                    enabled: true,
                    runs: 200,
                },
                //     evmVersion: "byzantium"
            },
        },
    },
}
