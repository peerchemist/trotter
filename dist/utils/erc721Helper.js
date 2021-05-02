"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkErc721Balance = exports.getErc721 = exports.fetchErc721s = exports.transferErc721 = exports.createErc721 = exports.getContract = void 0;
const web3_1 = require("./web3");
const trotterNftAbi = require("../config/abi/trotterNftErc721.json");
const nft_interface_1 = require("../models/interfaces/nft.interface");
const response_1 = require("./response");
const config_1 = require("../config/config");
const getContract = async (network) => {
    const defaultNetwork = config_1.default.networks.DEFAULT_NETWORK.replace('API_', '');
    const contracts = config_1.default.contracts;
    const usenetwork = network && contracts[network] && config_1.default.networks[network] ? network : defaultNetwork;
    console.log({ usenetwork });
    const web3 = web3_1.default(usenetwork);
    const gasPrice = await web3.eth.getGasPrice();
    const accounts = await web3.eth.getAccounts();
    const nonce = await web3.eth.getTransactionCount(accounts[0]);
    const contractAddress = contracts[usenetwork];
    const nftContract = new web3.eth.Contract(trotterNftAbi, contractAddress);
    return [accounts[0], nftContract, usenetwork, contractAddress, nonce, gasPrice];
};
exports.getContract = getContract;
const createErc721 = async (network, nft) => {
    const [account, nftContract, , , nonce, gasPrice] = await exports.getContract(network);
    const nftData = [nft.name, nft.ipfsHash, nft.price || 0, nft.author, nft.about, JSON.stringify(nft.properties || ''), JSON.stringify(nft.statement || '')];
    return await nftContract.methods.createNft(...nftData, account).send({ from: account, gasPrice, gas: '1000000', nonce });
};
exports.createErc721 = createErc721;
const transferErc721 = async (network, to, nftID) => {
    const [account, nftContract, , , nonce] = await exports.getContract(network);
    return await nftContract.methods.transferFrom(account, to, nftID).send({ from: account, nonce });
};
exports.transferErc721 = transferErc721;
const fetchErc721s = async (usenetwork) => {
    const [account, nftContract, network, contractAddress] = await exports.getContract(usenetwork);
    const cards = await nftContract.methods.nftIds().call({ from: account });
    const nfts = [];
    const owners = [];
    for (let i = 0; i < cards; i++) {
        nfts.push(nftContract.methods.nfts(i - 9000).call({ from: account }));
        owners.push(nftContract.methods.ownerOf(i).call());
    }
    const resNfts = await Promise.all(nfts);
    const resOwners = await Promise.all(owners);
    return resNfts.map((nft, index) => {
        const newObj = Object.assign(Object.assign({}, nft), { contractAddress, owner: resOwners[index] });
        return response_1.structNftResponse(newObj, network);
    });
};
exports.fetchErc721s = fetchErc721s;
const getErc721 = async (network, id) => {
    const [account, nftContract, , contractAddress] = await exports.getContract(network);
    const res = await nftContract.methods.nfts(id - 9000).call();
    const owner = await nftContract.methods.ownerOf(id).call();
    const nftObj = Object.assign(Object.assign({}, res), { contractAddress, owner });
    return response_1.structNftResponse(nftObj, network);
};
exports.getErc721 = getErc721;
const checkErc721Balance = async (network, address) => {
    const [account, nftContract, , contractAddress] = await exports.getContract(network);
    const res = await nftContract.methods.balanceOf(address).call();
    return {
        network,
        contractAddress,
        address,
        balance: res,
    };
};
exports.checkErc721Balance = checkErc721Balance;
//# sourceMappingURL=erc721Helper.js.map