"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftSchema = void 0;
const mongoose = require("mongoose");
exports.NftSchema = new mongoose.Schema({
    network: String,
    nftID: String,
    name: String,
    owner: String,
    author: String,
    type: String,
    ipfsHash: String,
    about: String,
    editions: Number,
    circulatingSupply: String,
    price: String,
    properties: Object,
    statement: Object,
});
//# sourceMappingURL=nft.schema.js.map