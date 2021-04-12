import { Injectable, Res } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Nft, TransferNft, MigrateNft, ResponseData } from '../../models/interfaces/nft.interface';
import ipfs from '../../utils/ipfs';
import { createNFT, transferNFT, migrateNFT, fetchNFTs, getNFT } from 'src/utils/contractHelper';
import { response, nftResponse } from 'src/utils/response';

@Injectable()
export class NftsService {
  constructor(@InjectModel('Nft') private readonly nftModel: Model<any>) { }

  // Get nft data from chain to validate what users preview
  async findOne(id: number): Promise<ResponseData> {
    try {
      const chainNft = await getNFT(id);
      if (!chainNft || !chainNft.name)
        return response({}, 'Nft metadata not found!!', false);

      return response(chainNft, '', true);
    } catch (error) {
      return nftResponse(error.message);
    }
  }

  async findAll(): Promise<ResponseData> {
    try {
      const localNfts = await this.nftModel.find();
  
      if (localNfts.length < 1) {
        const chainNfts = await fetchNFTs();
  
        if (chainNfts.length < 1)
          return response([], 'No nfts created yet!!', false);
  
        return response(chainNfts, 'Nfts fetched successfully', true);
      }
  
      return response(localNfts, 'Nfts fetched successfully', true);
    } catch (error) {
      return nftResponse(error.message)
    }
  }

  async create(nft: Nft, fileBuffer: Buffer): Promise<ResponseData> {
    try {
      const res = await ipfs.add(fileBuffer);
      nft.ipfsHash = res.path;
      // send to nft smart contract for mint
      const nftRes = await createNFT(nft);

      // update nft object with nftId created on the blockchain
      nft.nftID = nftRes.events.CardAdded.returnValues.id

      const newNft = new this.nftModel(nft);
      const save = await newNft.save();
      return response(save, 'Nft created successfully', true, nftRes.transactionHash);
    } catch (error) {
      return nftResponse(error.message);
    }
  }

  async transferNft(nft: TransferNft): Promise<ResponseData> {
    try {
      // transfer nft smart contract for mint
      const nftRes = await transferNFT(nft.network, nft.from, nft.destination, nft.tokenid);

      // update nft on database with new owner
      let nftData = await this.nftModel.findOne({ nftID: nft.tokenid });
      if (!nftData || !nftData.nftID) {
        const chainNft = await getNFT(nft.tokenid)

        if (!chainNft || !chainNft.name)
          return response({}, 'Nft metadata not found!!', false);

        return response(chainNft, 'Nft transferred successfully', true, nftRes.transactionHash);
      }

      nftData.owner = nft.destination;
      const newData = await nftData.save();
      return response(newData, 'Nft transferred successfully', true, nftRes.transactionHash);
    } catch (error) {
      return nftResponse(error.message);
    }
  }

  async migrateNft(nft: MigrateNft): Promise<ResponseData> {
    try {
      // transfer nft smart contract from one blockchain network to another
      // await migrateNFT(nft.fromNetwork, nft.toNetwork, nft.tokenid);

      // update nft on database with new network
      const nftData = await this.nftModel.findOne({ nftID: nft.tokenid });
      // nftData.network = nft.toNetwork;

      return await nftData.save();
    } catch (error) {
      console.log(error);
      return nftResponse(error.message);
    }
  }
}