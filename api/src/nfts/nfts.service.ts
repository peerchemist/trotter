import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Nft } from './interfaces/nft.interface';

@Injectable()
export class NftsService {
  constructor(@InjectModel('Nft') private readonly nftModel: Model<any>) {}

  async findOne(id: string): Promise<Nft> {
    return await this.nftModel.findOne({ _id: id });
  }

  async create(nft: Nft): Promise<Nft> {
    const newNft = new this.nftModel(nft);
    return await newNft.save();
  }
}