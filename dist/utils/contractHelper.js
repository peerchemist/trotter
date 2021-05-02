"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchNFTEditions = exports.mintNFT = exports.checkNFTBalance = exports.getNFT = exports.fetchNFTHolders = exports.fetchNFTs = exports.migrateNFT = exports.transferNFT = exports.createNFT = exports.isErc721 = exports.getContract = void 0;
const web3_1 = require("./web3");
const trotterNftAbi = require("../config/abi/trotterNft.json");
const nft_interface_1 = require("../models/interfaces/nft.interface");
const response_1 = require("./response");
const config_1 = require("../config/config");
const getContract = async (network) => {
    const defaultNetwork = config_1.default.networks.DEFAULT_NETWORK.replace('API_', '');
    const contracts = config_1.default.contracts;
    const usenetwork = contracts[network] && config_1.default.networks[network] ? network : defaultNetwork;
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
const isErc721 = async (network) => {
    if (network && config_1.default.listedNetworks[network] === 'erc721')
        return true;
    return false;
};
exports.isErc721 = isErc721;
const createNFT = async (network, nft) => {
    const [account, nftContract, usenetwork, , nonce, gasPrice] = await exports.getContract(nft.network);
    const nftData = [nft.name, nft.ipfsHash, nft.price, nft.author, nft.about, JSON.stringify(nft.properties || ''), JSON.stringify(nft.statement || '')];
    return await nftContract.methods.createNftCard(...nftData, account, nft.editions, 1).send({ from: account, gasPrice, gas: '1000000', nonce });
};
exports.createNFT = createNFT;
const transferNFT = async (network, to, nftID) => {
    const [account, nftContract, , , nonce] = await exports.getContract(network);
    return await nftContract.methods.transfer(account, to, nftID, 1).send({ from: account, nonce });
};
exports.transferNFT = transferNFT;
const migrateNFT = async (fromNetwork, toNetwork, nftID) => {
    const [account, nftContract] = await exports.getContract(fromNetwork);
};
exports.migrateNFT = migrateNFT;
const fetchNFTs = async (usenetwork) => {
    const [account, nftContract, network, contractAddress] = await exports.getContract(usenetwork);
    const cards = await nftContract.methods.cards().call({ from: account });
    const nfts = [];
    const maxs = [];
    const circulatings = [];
    const balances = [];
    for (let i = 0; i < cards; i++) {
        balances.push(nftContract.methods.balanceOf(account, i + 1).call());
        nfts.push(nftContract.methods.nfts(i).call({ from: account }));
        maxs.push(nftContract.methods.totalSupply(i + 1).call());
        circulatings.push(nftContract.methods.circulatingSupply(i + 1).call());
    }
    const resMaxs = await Promise.all(maxs);
    const resCirculatings = await Promise.all(circulatings);
    const resNfts = await Promise.all(nfts);
    const resBalances = await Promise.all(balances);
    return resNfts.map((nft, index) => {
        const adminBalance = resBalances[index] > 0 ? resBalances[index] : undefined;
        const newObj = Object.assign(Object.assign({}, nft), { editions: resMaxs[index], circulatingSupply: resCirculatings[index], contractAddress, balance: adminBalance });
        return response_1.structNftResponse(newObj, network);
    });
};
exports.fetchNFTs = fetchNFTs;
const fetchNFTHolders = async (network, id) => {
    const [account, nftContract, , contractAddress] = await exports.getContract(network);
    const holders = [];
    let moreHolder = true;
    let i = 0;
    while (moreHolder) {
        try {
            holders.push((await nftContract.methods.nftOwners(id, i).call({ from: account })));
            i++;
        }
        catch (error) {
            moreHolder = false;
        }
    }
    const resholders = await Promise.all(holders);
    const res = [];
    for (let i = 0; i < resholders.length; i++) {
        if (resholders[i] !== "0x0000000000000000000000000000000000000000" && !res.find(h => h.address == resholders[i])) {
            const balance = await nftContract.methods.balanceOf(resholders[i], id).call();
            res.push({ address: resholders[i], balance, network, contractAddress });
        }
    }
    return res;
};
exports.fetchNFTHolders = fetchNFTHolders;
const getNFT = async (network, id) => {
    const [account, nftContract, , contractAddress] = await exports.getContract(network);
    const res = await nftContract.methods.nfts(id - 1).call({ from: account });
    const nftObj = Object.assign(Object.assign({}, res), { contractAddress });
    return response_1.structNftResponse(nftObj, network);
};
exports.getNFT = getNFT;
const checkNFTBalance = async (network, id, address) => {
    const [account, nftContract, , contractAddress] = await exports.getContract(network);
    const res = await nftContract.methods.balanceOf(address, id).call();
    return {
        network,
        contractAddress,
        address,
        balance: res,
    };
};
exports.checkNFTBalance = checkNFTBalance;
const mintNFT = async (network, nftID, to, amount) => {
    const [account, nftContract, , , nonce] = await exports.getContract(network);
    return await nftContract.methods.mint(to, nftID, amount).send({ from: account, nonce });
};
exports.mintNFT = mintNFT;
const fetchNFTEditions = async (network, id) => {
    const [account, nftContract, , contractAddress] = await exports.getContract(network);
    const nft = await nftContract.methods.getNft(id).call({ from: account });
    const holders = await exports.fetchNFTHolders(network, id);
    const res = [];
    holders.map((holder) => {
        const newObj = Object.assign(Object.assign({}, nft), { owner: holder.address, balance: holder.balance, network, contractAddress });
        if (!res.find(h => h.owner == holder))
            res.push(response_1.structNftResponse(newObj, network));
    });
    return res;
};
exports.fetchNFTEditions = fetchNFTEditions;
//# sourceMappingURL=contractHelper.js.map