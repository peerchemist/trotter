import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Nft, TransferNft, MigrateNft } from './interfaces/nft.interface';
import ipfs from '../utils/ipfs';
import { createNFT, transferNFT, migrateNFT } from 'src/utils/contractHelper';

@Injectable()
export class NftsService {
  constructor(@InjectModel('Nft') private readonly nftModel: Model<any>) {}

  async findOne(id: number): Promise<Nft> {
    return await this.nftModel.findOne({ nftID: id });
  }

  async findAll(): Promise<Nft[]> {
    return await this.nftModel.find();
  }

  async create(nft: Nft, fileBuffer: Buffer): Promise<Nft> {
    try {
      const res = await ipfs.add(fileBuffer);
      nft.ipfsHash = res.path;
      // send to nft smart contract for mint
      const nftRes = await createNFT(nft);
      // update nft object with nftId created on the blockchain
      nft.nftID = nftRes.events.CardAdded.returnValues.id
      
      const newNft = new this.nftModel(nft);
      return await newNft.save();
    } catch (error) {
      console.log(error);
    }
  }
  
  async transferNft(nft: TransferNft): Promise<Nft> {
    try {
      // transfer nft smart contract for mint
      await transferNFT(nft.network, nft.from, nft.destination, nft.tokenid);

      // update nft on database with new owner
      const nftData = await this.nftModel.findOne({ nftID: nft.tokenid });
      nftData.owner = nft.destination;
      
      return await nftData.save();
    } catch (error) {
      console.log(error);
    }
  }
  
  async migrateNft(nft: MigrateNft): Promise<Nft> {
    try {
      // transfer nft smart contract from one blockchain network to another
      // await migrateNFT(nft.fromNetwork, nft.toNetwork, nft.tokenid);

      // update nft on database with new network
      const nftData = await this.nftModel.findOne({ nftID: nft.tokenid });
      nftData.network = nft.toNetwork;
      
      return await nftData.save();
    } catch (error) {
      console.log(error);
    }
  }
}