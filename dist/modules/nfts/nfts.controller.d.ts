/// <reference types="multer" />
import { Response } from 'express';
import { Balance, Networks } from 'src/models/enums/nft.enums';
import { CreateNftDto, MigrateNftDto, MintNftDto } from '../../models/dtos/nft.dto';
import { ResponseData } from '../../models/interfaces/nft.interface';
import { NftsService } from './nfts.service';
export declare class NftsController {
    private readonly nftsService;
    constructor(nftsService: NftsService);
    create(createNftDto: CreateNftDto, file: Express.Multer.File, network?: Networks): Promise<ResponseData>;
    mintNewToken(mintNftDto: MintNftDto, id: number): Promise<ResponseData>;
    findOne(id: number, network?: Networks): Promise<ResponseData>;
    transfer(id: number, receiver: string, network?: Networks): Promise<ResponseData>;
    migrate(migrateNftDto: MigrateNftDto): Promise<ResponseData>;
    findAll(): Promise<ResponseData>;
    checkBalance(id: number, address: string, network?: Networks): Promise<ResponseData>;
    findTokenOwners(id: number, network?: Networks): Promise<ResponseData>;
    findTokenEditions(id: number, network?: Networks): Promise<ResponseData>;
    getAdminAddress(balance?: Balance, network?: Networks): Promise<ResponseData>;
    getMetadata(id: string, network?: Networks): Promise<ResponseData>;
    getLogs(response: Response): Promise<any>;
}
