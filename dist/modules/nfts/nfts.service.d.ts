/// <reference types="node" />
import { Model } from 'mongoose';
import { Nft, MigrateNft, ResponseData, MintNft } from '../../models/interfaces/nft.interface';
export declare class NftsService {
    private readonly nftModel;
    private readonly logger;
    constructor(nftModel: Model<any>);
    findOne(network: string, id: number): Promise<ResponseData>;
    findAll(): Promise<ResponseData>;
    create(network: string, nft: Nft, fileBuffer: Buffer): Promise<ResponseData>;
    transferNft(network: string, id: number, receiver: string): Promise<ResponseData>;
    checkBalance(network: string, id: number, address: string): Promise<ResponseData>;
    migrateNft(nft: MigrateNft): Promise<ResponseData>;
    fetchTokenHolders(network: string, id: number): Promise<ResponseData>;
    mintNewToken(id: number, data: MintNft): Promise<ResponseData>;
    fetchTokenEditions(network: any, id: number): Promise<ResponseData>;
    getAdminAddress(network: string, balance?: string): Promise<any>;
    getMetadata(network: string, id: string): Promise<any>;
}
