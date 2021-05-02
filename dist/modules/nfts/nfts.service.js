"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NftsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const ipfs_1 = require("../../utils/ipfs");
const contractHelper_1 = require("../../utils/contractHelper");
const response_1 = require("../../utils/response");
const erc721Helper_1 = require("../../utils/erc721Helper");
require('dotenv').config();
let NftsService = NftsService_1 = class NftsService {
    constructor(nftModel) {
        this.nftModel = nftModel;
        this.logger = new common_1.Logger(NftsService_1.name);
    }
    async findOne(network, id) {
        try {
            const resArr = await this.nftModel.findOne({ nftID: id, network });
            if (resArr && resArr.name)
                return response_1.response(resArr, 'Nft found', true);
            let chainNft;
            if (contractHelper_1.isErc721(network)) {
                chainNft = await erc721Helper_1.getErc721(network, id);
            }
            else {
                chainNft = await contractHelper_1.getNFT(network, id);
            }
            if (chainNft && chainNft.name)
                return response_1.response(chainNft, 'Nft found', true);
            return response_1.response({}, 'Nft metadata not found!!', false);
        }
        catch (error) {
            this.logger.error(error);
            if (error.message.includes("execution reverted"))
                return response_1.response({}, 'Nft not found!!', false);
            return response_1.nftResponse(error.message);
        }
    }
    async findAll() {
        const chainNfts = [];
        try {
            const resArr = await this.nftModel.find();
            if (resArr.length < 1) {
                return response_1.response([], 'No nfts created yet!!', false);
            }
            const nfts = resArr.map(nft => {
                let res = Object.assign({}, nft.toJSON());
                delete res._id;
                delete res.__v;
                return res;
            });
            return response_1.response(nfts, 'Nfts fetched successfully', true);
        }
        catch (error) {
            this.logger.error(error);
            if (chainNfts.length > 0)
                return response_1.response(chainNfts, 'Nfts fetched successfully', true);
            return response_1.nftResponse(error.message);
        }
    }
    async create(network, nft, fileBuffer) {
        try {
            const res = await ipfs_1.ipfsAdd(fileBuffer);
            nft.ipfsHash = res.path;
            let nftRes;
            if (contractHelper_1.isErc721(network)) {
                nftRes = await erc721Helper_1.createErc721(network, nft);
            }
            else {
                nftRes = await contractHelper_1.createNFT(network, nft);
            }
            nft.nftID = nftRes.events.CardAdded.returnValues.id;
            nft.network = nftRes.network;
            const newNft = new this.nftModel(nft);
            const save = await newNft.save();
            return response_1.response(save, 'Nft created successfully', true, nftRes.transactionHash);
        }
        catch (error) {
            this.logger.error(error);
            return response_1.nftResponse(error.message);
        }
    }
    async transferNft(network, id, receiver) {
        try {
            let nftRes;
            let chainNft;
            if (contractHelper_1.isErc721(network)) {
                nftRes = await erc721Helper_1.transferErc721(network, receiver, id);
                chainNft = await erc721Helper_1.getErc721(network, id);
            }
            else {
                nftRes = await contractHelper_1.transferNFT(network, receiver, id);
                chainNft = await contractHelper_1.getNFT(network, id);
            }
            if (!chainNft || !chainNft.name)
                return response_1.response({}, 'Nft metadata not found!!', false);
            return response_1.response(chainNft, 'Nft transfered successfully', true, nftRes.transactionHash);
        }
        catch (error) {
            this.logger.error(error);
            return response_1.nftResponse(error.message);
        }
    }
    async checkBalance(network, id, address) {
        try {
            let nftRes;
            if (contractHelper_1.isErc721(network)) {
                nftRes = await erc721Helper_1.checkErc721Balance(network, address);
            }
            else {
                nftRes = await contractHelper_1.checkNFTBalance(network, id, address);
            }
            if (!nftRes || !nftRes.balance)
                return response_1.response({}, 'Nft not found!!', false);
            return response_1.response(nftRes, 'Nft balance', true);
        }
        catch (error) {
            this.logger.error(error);
            return response_1.nftResponse(error.message);
        }
    }
    async migrateNft(nft) {
        try {
            const nftData = await this.nftModel.findOne({ nftID: nft.tokenid });
            return await nftData.save();
        }
        catch (error) {
            this.logger.error(error);
            return response_1.nftResponse(error.message);
        }
    }
    async fetchTokenHolders(network, id) {
        try {
            let nftRes;
            if (contractHelper_1.isErc721(network)) {
                nftRes = await erc721Helper_1.fetchErc721s(network);
            }
            else {
                nftRes = await contractHelper_1.fetchNFTHolders(network, id);
            }
            if (nftRes.length < 1)
                return response_1.response([], 'Nft not found', false);
            return response_1.response(nftRes, 'Nfts holders fetched successfully', true);
        }
        catch (error) {
            this.logger.error(error);
            return response_1.nftResponse(error.message);
        }
    }
    async mintNewToken(id, data) {
        try {
            const mintRes = await contractHelper_1.mintNFT(data.network, id, data.toAddress, data.amount);
            if (mintRes.length < 1)
                return response_1.response([], 'Nft not found', false);
            return response_1.response({}, 'Nfts mint successfully', true, mintRes.transactionHash);
        }
        catch (error) {
            this.logger.error(error);
            return response_1.nftResponse(error.message);
        }
    }
    async fetchTokenEditions(network, id) {
        try {
            let nftRes;
            if (contractHelper_1.isErc721(network)) {
                return response_1.response([], 'Erc721 editions not found', false);
            }
            else {
                nftRes = await contractHelper_1.fetchNFTEditions(network, id);
            }
            if (nftRes.length < 1)
                return response_1.response([], 'Nft not found', false);
            return response_1.response(nftRes, 'Nfts editions fetched successfully', true);
        }
        catch (error) {
            this.logger.error(error);
            return response_1.nftResponse(error.message);
        }
    }
    async getAdminAddress(network, balance) {
        const [address, nftContract,] = await contractHelper_1.getContract(network);
        const resbalance = balance == 'balance' ? await erc721Helper_1.checkErc721Balance(network, address) : undefined;
        return {
            message: "admin address",
            data: {
                network,
                adminAddress: address,
                balance: resbalance
            }
        };
    }
    async getMetadata(network, id) {
        try {
            const filterId = id.replace(/^0+/, '').split('.')[0];
            const nftId = filterId ? parseInt(filterId) : 0;
            let resData;
            if (contractHelper_1.isErc721(network)) {
                resData = await erc721Helper_1.getErc721(network, nftId);
            }
            else {
                resData = await contractHelper_1.getNFT(network, nftId);
            }
            return {
                name: resData.name,
                description: resData.description || "Trotter Nft collectibles",
                image: `https://ipfs.io/ipfs/${resData.ipfsHash}`,
                external_url: ""
            };
        }
        catch (error) {
            this.logger.error(error);
            return response_1.response({}, 'Nft not found', false);
            return {
                name: "Finite Trotter",
                description: "Trotter Nft collectibles",
                image: ``,
                external_url: ""
            };
        }
    }
};
NftsService = NftsService_1 = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_2.InjectModel('Nft')),
    __metadata("design:paramtypes", [mongoose_1.Model])
], NftsService);
exports.NftsService = NftsService;
//# sourceMappingURL=nfts.service.js.map