import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Nft } from './interfaces/nft.interface';
import ipfs from '../utils/ipfs';
import web3 from 'src/utils/web3';
import contracts from 'src/config/contracts';
import * as trotterNftAbi from '../config/abi/trotterNft.json';
const Web3 = require('web3');
const contract = require("@truffle/contract");

@Injectable()
export class NftsService {
  constructor(@InjectModel('Nft') private readonly nftModel: Model<any>) {}

  async findOne(id: string): Promise<Nft> {
    return await this.nftModel.findOne({ _id: id });
  }

  async create(nft: Nft, fileBuffer: Buffer): Promise<Nft> {
    try {
      const res = await ipfs.add(fileBuffer);
      nft.ipfsHash = res.path;
      
      const accounts: string[] = await web3.eth.getAccounts();
      const nftContract = contract({
        abi: trotterNftAbi
      });
      
      nftContract.setProvider(web3.currentProvider);
      const instance = await nftContract.deployed();
      await instance.createNftCard(nft.name, nft.ipfsHash, nft.owner, nft.totalSupply, 1, { from: accounts[0] });
      
      const newNft = new this.nftModel(nft);
      return await newNft.save();
    } catch (error) {
      console.log(error);
    }
  }
}