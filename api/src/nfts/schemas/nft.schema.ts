import * as mongoose from 'mongoose'

export const NftSchema = new mongoose.Schema({
    nftID: String,
    owner: String,
    ipfsHash: String,
    name: String,
    description: String,
    circulatingSupply: String,
    totalSupply: String,
})