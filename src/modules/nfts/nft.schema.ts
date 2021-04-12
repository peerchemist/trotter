import * as mongoose from 'mongoose'

export const NftSchema = new mongoose.Schema({
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
})