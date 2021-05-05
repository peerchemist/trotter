import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Nft, NftDAO } from '../../models/interfaces/nft.interface';
import { Model } from 'mongoose';

@Injectable()
export class MongoDB implements NftDAO {
  constructor(@InjectModel('Nft') private readonly nftModel: Model<any>) { }

  async findOne(id: number, network: string) {
    let model = await this.nftModel.findOne({
      nftId: id,
      ...(network ? { network } : {}), // optional
    });

    if (model) {
      model = model.toJSON();
      delete model._id;
      delete model.__v;
    }

    return model || null;
  }

  async findAll() {
    let collection = (await this.nftModel.find()) || [];
    collection = collection.map((model) => {
      const res = model.toJSON();
      delete res._id;
      delete res.__v;
      return res;
    });

    return collection;
  }

  async create(nft: Nft) {
    const newNft = new this.nftModel(nft);
    const savedModel = await newNft.save();
    const res = savedModel.toJSON();
    delete res.__id;
    delete res.__v;

    return res;
  }
}
