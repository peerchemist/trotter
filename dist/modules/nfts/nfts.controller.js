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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const nft_enums_1 = require("../../models/enums/nft.enums");
const nft_dto_1 = require("../../models/dtos/nft.dto");
const nfts_service_1 = require("./nfts.service");
const fs = require('fs');
let NftsController = class NftsController {
    constructor(nftsService) {
        this.nftsService = nftsService;
    }
    create(createNftDto, file, network = nft_enums_1.Networks.DEFAULT) {
        return this.nftsService.create(network, createNftDto, file.buffer);
    }
    mintNewToken(mintNftDto, id) {
        return this.nftsService.mintNewToken(id, mintNftDto);
    }
    findOne(id, network = nft_enums_1.Networks.DEFAULT) {
        return this.nftsService.findOne(network, id);
    }
    transfer(id, receiver, network = nft_enums_1.Networks.DEFAULT) {
        return this.nftsService.transferNft(network, id, receiver);
    }
    migrate(migrateNftDto) {
        return this.nftsService.migrateNft(migrateNftDto);
    }
    findAll() {
        return this.nftsService.findAll();
    }
    checkBalance(id, address, network = nft_enums_1.Networks.DEFAULT) {
        return this.nftsService.checkBalance(network, id, address);
    }
    findTokenOwners(id, network = nft_enums_1.Networks.DEFAULT) {
        return this.nftsService.fetchTokenHolders(network, id);
    }
    findTokenEditions(id, network = nft_enums_1.Networks.DEFAULT) {
        return this.nftsService.fetchTokenEditions(network, id);
    }
    getAdminAddress(balance = nft_enums_1.Balance.default, network = nft_enums_1.Networks.DEFAULT) {
        return this.nftsService.getAdminAddress(network, balance);
    }
    getMetadata(id, network = nft_enums_1.Networks.DEFAULT) {
        return this.nftsService.getMetadata(network, id);
    }
    async getLogs(response) {
        const filename = __dirname + '/../../../errors.log';
        const readStream = await fs.createReadStream(filename);
        response.set({
            'Content-Type': 'multipart/form-data',
        });
        return readStream.pipe(response);
    }
};
__decorate([
    swagger_1.ApiOperation({
        summary: 'Create a NFT token',
        description: 'Create NFT token on a blockchain of choice by passing required metadata. In answer there is going to be the txid.'
    }),
    swagger_1.ApiTags('admin'),
    common_1.Post('create'),
    swagger_1.ApiConsumes('multipart/form-data'),
    swagger_1.ApiBody({
        type: nft_dto_1.CreateNftDto,
    }),
    swagger_1.ApiHeader({ name: 'network', enum: nft_enums_1.Networks }),
    swagger_1.ApiResponse({ status: 201, description: 'item created' }),
    swagger_1.ApiResponse({ status: 400, description: 'invalid input | {msg}' }),
    swagger_1.ApiResponse({ status: 409, description: 'an existing token already exists.' }),
    swagger_1.ApiResponse({ status: 500, description: 'unexpected error.' }),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('file')),
    __param(0, common_1.Body()), __param(1, common_1.UploadedFile()), __param(2, common_1.Headers('network')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [nft_dto_1.CreateNftDto, Object, String]),
    __metadata("design:returntype", Promise)
], NftsController.prototype, "create", null);
__decorate([
    swagger_1.ApiOperation({
        summary: 'Mint new edition of NFT.',
        description: ''
    }),
    swagger_1.ApiTags('admin'),
    swagger_1.ApiHeader({ name: 'network', enum: nft_enums_1.Networks }),
    common_1.Post('/token/:tokenId/mint'),
    __param(0, common_1.Body()), __param(1, common_1.Param('tokenId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [nft_dto_1.MintNftDto, Number]),
    __metadata("design:returntype", Promise)
], NftsController.prototype, "mintNewToken", null);
__decorate([
    swagger_1.ApiOperation({
        summary: 'Get detail information about NFT token.',
        description: ''
    }),
    swagger_1.ApiTags('admin'),
    swagger_1.ApiHeader({ name: 'network', enum: nft_enums_1.Networks }),
    common_1.Get('token/:tokenId'),
    swagger_1.ApiResponse({ status: 201, description: 'token items.' }),
    swagger_1.ApiResponse({ status: 404, description: 'token not found.' }),
    swagger_1.ApiResponse({ status: 400, description: 'invalid input' }),
    swagger_1.ApiResponse({ status: 409, description: 'no tokens.' }),
    swagger_1.ApiResponse({ status: 500, description: 'unexpected error.' }),
    __param(0, common_1.Param('tokenId', common_1.ParseIntPipe)), __param(1, common_1.Headers('network')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], NftsController.prototype, "findOne", null);
__decorate([
    swagger_1.ApiOperation({
        summary: 'Transfer NFT token to another address.',
        description: ''
    }),
    swagger_1.ApiTags('admin'),
    swagger_1.ApiHeader({ name: 'network', enum: nft_enums_1.Networks }),
    common_1.Post('transfer/:tokenId/:userAddress'),
    __param(0, common_1.Param('tokenId', common_1.ParseIntPipe)), __param(1, common_1.Param('userAddress')), __param(2, common_1.Headers('network')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], NftsController.prototype, "transfer", null);
__decorate([
    swagger_1.ApiOperation({
        summary: 'Migrate NFT token to another network.',
        description: 'At the moment only transfer between Ethereum and Matic networks are supported.'
    }),
    swagger_1.ApiTags('admin'),
    common_1.Post('token/:tokenId/migrate'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [nft_dto_1.MigrateNftDto]),
    __metadata("design:returntype", Promise)
], NftsController.prototype, "migrate", null);
__decorate([
    swagger_1.ApiOperation({
        summary: 'List all issued NFT token.',
        description: ''
    }),
    swagger_1.ApiTags('admin'),
    common_1.Get('list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NftsController.prototype, "findAll", null);
__decorate([
    swagger_1.ApiOperation({
        summary: 'Get token balance of {address}.',
        description: ''
    }),
    swagger_1.ApiHeader({ name: 'network', enum: nft_enums_1.Networks }),
    common_1.Get('/balance/:tokenId/:address'),
    swagger_1.ApiHeader({ name: 'network', enum: nft_enums_1.Networks }),
    __param(0, common_1.Param('tokenId', common_1.ParseIntPipe)), __param(1, common_1.Param('address')), __param(2, common_1.Headers('network')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], NftsController.prototype, "checkBalance", null);
__decorate([
    swagger_1.ApiOperation({
        summary: 'Get list of current owners of this NFT.',
        description: ''
    }),
    swagger_1.ApiHeader({ name: 'network', enum: nft_enums_1.Networks }),
    common_1.Get('/token/:tokenId/owners'),
    __param(0, common_1.Param('tokenId', common_1.ParseIntPipe)), __param(1, common_1.Headers('network')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], NftsController.prototype, "findTokenOwners", null);
__decorate([
    swagger_1.ApiOperation({
        summary: 'List currently issued editions of a NFT.',
        description: ''
    }),
    swagger_1.ApiHeader({ name: 'network', enum: nft_enums_1.Networks }),
    common_1.Get('/token/:tokenId/editions'),
    __param(0, common_1.Param('tokenId', common_1.ParseIntPipe)), __param(1, common_1.Headers('network')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], NftsController.prototype, "findTokenEditions", null);
__decorate([
    swagger_1.ApiOperation({
        summary: 'Get address of currently set privatekey/mnemonic.',
        description: ''
    }),
    common_1.Get('/address'),
    swagger_1.ApiHeader({ name: 'network', enum: nft_enums_1.Networks }),
    swagger_1.ApiQuery({ name: 'balance', enum: nft_enums_1.Balance }),
    __param(0, common_1.Query('balance')), __param(1, common_1.Headers('network')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NftsController.prototype, "getAdminAddress", null);
__decorate([
    swagger_1.ApiOperation({
        summary: 'Get NFT metadata.',
        description: ''
    }),
    common_1.Get('/nfts/:tokenId'),
    swagger_1.ApiHeader({ name: 'network', enum: nft_enums_1.Networks }),
    __param(0, common_1.Param('tokenId')), __param(1, common_1.Headers('network')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NftsController.prototype, "getMetadata", null);
__decorate([
    swagger_1.ApiOperation({
        summary: 'Get logs file',
        description: ''
    }),
    common_1.Get('/log'),
    __param(0, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NftsController.prototype, "getLogs", null);
NftsController = __decorate([
    common_1.Controller(),
    __metadata("design:paramtypes", [nfts_service_1.NftsService])
], NftsController);
exports.NftsController = NftsController;
//# sourceMappingURL=nfts.controller.js.map