import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Nft } from './interfaces/nft.interface';
import ipfs from '../utils/ipfs';
import QRCode from 'qrcode' 

@Injectable()
export class NftsService {
  constructor(@InjectModel('Nft') private readonly nftModel: Model<any>) {}

  async findOne(id: number): Promise<Nft> {
    return await this.nftModel.findOne({ nftId: id });
  }

  async findAll(): Promise<Nft[]> {
    return await this.nftModel.find();
  }

  async create(nft: Nft, fileBuffer: Buffer): Promise<Nft> {
    try {
      const res = await ipfs.add(fileBuffer);
      nft.ipfsHash = res.path;

      const newNft = new this.nftModel(nft);
      return await newNft.save();
    } catch (error) {
      console.log(error);
    }
  }

  async createQrCode(nftId: number): Promise<String> {
    return await QRCode.toDataURL(nftId);
  }
}