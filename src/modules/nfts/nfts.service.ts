import { Injectable, Logger, Res } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Nft, TransferNft, MigrateNft, ResponseData, MintNft } from '../../models/interfaces/nft.interface';
import { ipfsAdd } from '../../utils/ipfs';
import { createNFT, transferNFT, migrateNFT, fetchNFTs, getNFT, fetchNFTHolders, checkNFTBalance, mintNFT, fetchNFTEditions, getContract, isErc721 } from 'src/utils/contractHelper';
import { response, nftResponse } from 'src/utils/response';
import { checkErc721Balance, createErc721, fetchErc721s, getErc721, transferErc721 } from 'src/utils/erc721Helper';
import config from 'src/config/config';
require('dotenv').config();

@Injectable()
export class NftsService {
  private readonly logger = new Logger(NftsService.name);
  constructor(@InjectModel('Nft') private readonly nftModel: Model<any>) { }

  // Get nft data from chain to validate what users preview
  async findOne(id: number): Promise<ResponseData> {
    try {
      const resArr = await this.nftModel.findOne({nftID: id});
      if (resArr && resArr.name)
        return response(resArr, 'Nft found', true);
      
      let chainNft: any;
      if (isErc721()) {
         chainNft = await getErc721(id);
      } else {
        chainNft = await getNFT(id);
      }
      
      if (chainNft && chainNft.name)
        return response(chainNft, 'Nft found', true);
      
      return response({}, 'Nft metadata not found!!', false);
    } catch (error) {
      this.logger.error(error);
      if (error.message.includes("execution reverted"))
        return response({}, 'Nft not found!!', false);
      return nftResponse(error.message);
    }
  }

  async findAll(): Promise<ResponseData> {
    const chainNfts = [];
    try {
      const resArr = await this.nftModel.find();
      if (resArr.length < 1) {
        return response([], 'No nfts created yet!!', false);
      //   let arr = [];
      //   for (let i = 0; i < config.listNetworks.length; i++) {
      //     console.log(config.listNetworks[i]);
      //     if (isErc721()) {
      //       arr.push(fetchErc721s(config.listNetworks[i]));
      //     } else {
      //       arr.push(fetchNFTs(config.listNetworks[i]));
      //     }
      //   }
  
      //   (await Promise.all(arr)).map(data => chainNfts.push(...data));
  
      //   if (chainNfts.length < 1)
      //     return response([], 'No nfts created yet!!', false);
  
      //   return response(chainNfts, 'Nfts fetched successfully', true);
      }
      
      const nfts = resArr.map(nft => {
        let res = { ...nft.toJSON() };
        delete res._id;
        delete res.__v;
        return res;
      })

      return response(nfts, 'Nfts fetched successfully', true);
    } catch (error) {
      this.logger.error(error);
      if (chainNfts.length > 0)
        return response(chainNfts, 'Nfts fetched successfully', true);
      return nftResponse(error.message)
    }
  }

  async create(nft: Nft, fileBuffer: Buffer): Promise<ResponseData> {
    try {
      const res = await ipfsAdd(fileBuffer);
      nft.ipfsHash = res.path;

      let nftRes: any;
      if (isErc721()) {
        nftRes = await createErc721(nft);
      } else {
        // send to nft smart contract for mint
        nftRes = await createNFT(nft);
      }

      // update nft object with nftId created on the blockchain
      nft.nftID = nftRes.events.CardAdded.returnValues.id;
      nft.network = nft.network || config.networks.DEFAULT_NETWORK.replace('API_', '');

      const newNft = new this.nftModel(nft);
      const save = await newNft.save();
      return response(save, 'Nft created successfully', true, nftRes.transactionHash);
    } catch (error) {
      this.logger.error(error);
      return nftResponse(error.message);
    }
  }

  async transferNft(id: number, receiver: string): Promise<ResponseData> {
    try {
      // transfer nft 
      let nftRes: any;
      if (isErc721()) {
        nftRes = await transferErc721("", receiver, id);
      } else {
        nftRes = await transferNFT("", receiver, id);
      }

      const chainNft = await getNFT(id, "");

      if (!chainNft || !chainNft.name)
        return response({}, 'Nft metadata not found!!', false);

      return response(chainNft, 'Nft transfered successfully', true, nftRes.transactionHash);

    } catch (error) {
      this.logger.error(error);
      return nftResponse(error.message);
    }
  }

  async checkBalance(id: number, address: string): Promise<ResponseData> {
    try {
      let nftRes: any;
      if (isErc721()) {
        nftRes = await checkErc721Balance(address);
      } else {
        nftRes = await checkNFTBalance(id, address);
      }

      if (!nftRes || !nftRes.balance)
        return response({}, 'Nft not found!!', false);

      return response(nftRes, 'Nft balance', true);
    } catch (error) {
      this.logger.error(error);
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
      this.logger.error(error);
      return nftResponse(error.message);
    }
  }

  async fetchTokenHolders(id: number): Promise<ResponseData> {
    try {
      let nftRes: any;
      if (isErc721()) {
        nftRes = await fetchErc721s();
      } else {
        nftRes = await fetchNFTHolders(id);
      }

      // const chainNfts = await fetchNFTHolders(id);
      
      if (nftRes.length < 1)
        return response([], 'Nft not found', false);

      return response(nftRes, 'Nfts holders fetched successfully', true);
    } catch (error) {
      this.logger.error(error);
      return nftResponse(error.message)
    }
  }
  
  async mintNewToken(id: number, data: MintNft): Promise<ResponseData> {
    try {
      const mintRes = await mintNFT(data.network, id, data.toAddress, data.amount);
      
      if (mintRes.length < 1)
        return response([], 'Nft not found', false);
      
      return response({}, 'Nfts mint successfully', true, mintRes.transactionHash);
    } catch (error) {
      this.logger.error(error);
      return nftResponse(error.message)
    }
  }

  async fetchTokenEditions(id: number): Promise<ResponseData> {
    try {
      let nftRes: any;
      if (isErc721()) {
        return response([], 'Erc721 editions not found', false);
      } else {
        nftRes = await fetchNFTEditions(id);
      }
      
      if (nftRes.length < 1)
        return response([], 'Nft not found', false);
  
      return response(nftRes, 'Nfts editions fetched successfully', true);
    } catch (error) {
      this.logger.error(error);
      return nftResponse(error.message)
    }
  }

  async getAdminAddress(balance?: string): Promise<any> {
    const [address, nftContract, network] = await getContract();
    const resbalance = balance == 'balance' ? await checkErc721Balance(address) : undefined;

    return {
      message: "admin address",
      data: {
        network,
        adminAddress: address,
        balance: resbalance
      }
    }
  }
  
  async getMetadata(id: string): Promise<any> {
    try {
      const filterId = id.replace(/^0+/, '').split('.')[0];
      const nftId = filterId ? parseInt(filterId) : 0;

      let resData: any;
      // resData = await this.nftModel.findOne({nftID: nftId});
      // if (!resData || !resData.name) {
        // return response({}, 'Nft not found', false);
        if (isErc721()) {
           resData = await getErc721(nftId);
        } else {
          resData = await getNFT(nftId);
        }
      // }
      
      return {
        name: resData.name,
        description: resData.description || "Trotter Nft collectibles",
        image: `https://ipfs.io/ipfs/${resData.ipfsHash}`,
        external_url: ""
      };
    } catch (error) {
      this.logger.error(error);
      return response({}, 'Nft not found', false);
      return {
        name: "Finite Trotter",
        description: "Trotter Nft collectibles",
        image: ``,
        external_url: ""
      };
    }
  }
}
