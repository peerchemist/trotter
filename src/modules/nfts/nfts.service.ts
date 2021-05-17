import { Injectable, Res } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Nft, TransferNft, MigrateNft, ResponseData, MintNft } from '../../models/interfaces/nft.interface';
import { ipfsAdd } from '../../utils/ipfs';
import { createNFT, transferNFT, migrateNFT, fetchNFTs, getNFT, fetchNFTHolders, checkNFTBalance, mintNFT, fetchNFTEditions, isErc721 } from 'src/utils/contractHelper';
import { response, nftResponse } from 'src/utils/response';
import { checkErc721Balance, createErc721, fetchErc721s, getErc721, transferErc721, getContract, getNetworkByPrefix } from 'src/utils/erc721Helper';
import { Logger } from "nestjs-pino";
require('dotenv').config()
@Injectable()
export class NftsService {
  constructor(@InjectModel('Nft') private readonly nftModel: Model<any>, private readonly logger: Logger) { }

  // Get nft data from chain to validate what users preview
  async findOne(network: string, id: string): Promise<ResponseData> {
    try {
      const find = await this.nftModel.findOne({ nftID: id, network });
      const resArr = find && find.toJSON();
      delete resArr._id;
      delete resArr.__v;
      if (resArr && resArr.name)
        return response(resArr, 'Nft found', true);

      let chainNft: any;
      if (isErc721(network)) {
         chainNft = await getErc721(network, id);
      } else {
        chainNft = await getNFT(network, parseInt(id));
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

  async findAll(address?: string): Promise<ResponseData> {
    const chainNfts = [];
    try {
      let resArr: any; 
      resArr = address ? await this.nftModel.find({owner: address}) : await this.nftModel.find();
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

  async create(network: string, nft: Nft, fileBuffer: Buffer): Promise<ResponseData> {
    try {
      const res = await ipfsAdd(fileBuffer);
      nft.ipfsHash = res.path;

      let nftRes: any;
      if (isErc721(network)) {
        console.log('here');
        
        nftRes = await createErc721(network, nft);
      } else {
        // send to nft smart contract for mint
        nftRes = await createNFT(network, nft);
      }

      // update nft object with nftId created on the blockchain
      nft.nftID = nftRes.events.CardAdded.returnValues.id;
      nft.network = network;
      const [owner]: any[] = await getContract(network);
      nft.owner = owner;

      const newNft = new this.nftModel(nft);
      const save = await newNft.save();
      const resData = { ...save.toJSON() };
      delete resData._id;
      delete resData.__v;
      
      return response(resData, 'Nft created successfully', true, nftRes.transactionHash);
    } catch (error) {
      this.logger.error(error);
      return nftResponse(error.message);
    }
  }

  async transferNft(network: string, id: string, receiver: string): Promise<ResponseData> {
    try {
      // transfer nft
      let nftRes: any;
      let chainNft: any;
      if (isErc721(network)) {
        nftRes = await transferErc721(network, receiver, id);
        chainNft = await getErc721(network, id);
      } else {
        nftRes = await transferNFT(network, receiver, parseInt(id));
        chainNft = await getNFT(network, parseInt(id));
      }

      if (!chainNft || !chainNft.name)
        return response({}, 'Nft metadata not found!!', false);

      // update owner address on db
      const [tokenid, networkByPrefix] = getNetworkByPrefix(id);
      await this.nftModel.findOneAndUpdate({ nftID: tokenid, network: networkByPrefix || network }, { owner: receiver });

      return response(chainNft, 'Nft transfered successfully', true, nftRes.transactionHash);
    } catch (error) {
      this.logger.error(error);
      return nftResponse(error.message);
    }
  }

  async checkBalance(network: string, id: number, address: string): Promise<ResponseData> {
    try {
      let nftRes: any;
      if (isErc721(network)) {
        nftRes = await checkErc721Balance(network, address);
      } else {
        nftRes = await checkNFTBalance(network, id, address);
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

  async fetchTokenHolders(network: string, id: number): Promise<ResponseData> {
    try {
      let nftRes: any;
      if (isErc721(network)) {
        nftRes = await fetchErc721s(network);
      } else {
        nftRes = await fetchNFTHolders(network, id);
      }

      // const chainNfts = await fetchNFTHolders(id);

      if (nftRes.length < 1)
        return response([], 'Nft(s) not found', false);

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

  async fetchTokenEditions(network, id: number): Promise<ResponseData> {
    try {
      let nftRes: any;
      if (isErc721(network)) {
        return response([], 'Erc721 editions not found', false);
      } else {
        nftRes = await fetchNFTEditions(network, id);
      }

      if (nftRes.length < 1)
        return response([], 'Nft not found', false);

      return response(nftRes, 'Nfts editions fetched successfully', true);
    } catch (error) {
      this.logger.error(error);
      return nftResponse(error.message)
    }
  }

  async getAdminAddress(network: string, balance?: string): Promise<any> {
    const [address, nftContract, ] = await getContract(network);
    const resbalance = balance == 'balance' ? await checkErc721Balance(network, address) : undefined;

    return {
      message: "admin address",
      data: {
        network,
        address,
        ...resbalance
      }
    }
  }
  
  async getMetadata(network: string, id: string): Promise<any> {
    try {
      let resData: any;
      // resData = await this.nftModel.findOne({nftID: nftId});
      // if (!resData || !resData.name) {
        // return response({}, 'Nft not found', false);
      if (isErc721(network)) {
           resData = await getErc721(network, id);
        } else {
          resData = await getNFT(network, parseInt(id));
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
