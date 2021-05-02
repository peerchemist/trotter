"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const nfts_controller_1 = require("./nfts.controller");
const nfts_service_1 = require("./nfts.service");
const nft_schema_1 = require("./nft.schema");
let NftsModule = class NftsModule {
};
NftsModule = __decorate([
    common_1.Module({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: "Nft", schema: nft_schema_1.NftSchema }])],
        controllers: [nfts_controller_1.NftsController],
        providers: [nfts_service_1.NftsService],
    })
], NftsModule);
exports.NftsModule = NftsModule;
//# sourceMappingURL=nfts.module.js.map