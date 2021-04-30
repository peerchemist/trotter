import { Controller, Body, Get, Param, Post, Query, UseInterceptors, UploadedFile, ParseIntPipe, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Balance } from 'src/models/enums/nft.enums';
import { CreateNftDto, MigrateNftDto, MintNftDto, TransferNftDto } from '../../models/dtos/nft.dto';
import { ResponseData } from '../../models/interfaces/nft.interface';
import { NftsService } from './nfts.service';
import { Logger } from 'nestjs-pino';
const fs = require('fs');

@Controller()
export class NftsController {
  constructor(private readonly nftsService: NftsService, private readonly logger: Logger) { }

  @ApiOperation({
    summary: 'Create a NFT token',
    description: 'Create NFT token on a blockchain of choice by passing required metadata. In answer there is going to be the txid.'
  })
  @ApiTags('admin')
  @Post('create')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateNftDto,
  })
  @ApiResponse({ status: 201, description: 'item created' })
  @ApiResponse({ status: 400, description: 'invalid input | {msg}' })
  @ApiResponse({ status: 409, description: 'an existing token already exists.' })
  @ApiResponse({ status: 500, description: 'unexpected error.' })
  @UseInterceptors(FileInterceptor('file'))
  create(@Body() createNftDto: CreateNftDto, @UploadedFile() file: Express.Multer.File): Promise<ResponseData> {
    return this.nftsService.create(createNftDto, file.buffer);
  }

  @ApiOperation({
    summary: 'Mint new edition of NFT.',
    description: ''
  })
  @ApiTags('admin')
  @Post('/token/:tokenId/mint')
  mintNewToken(@Body() mintNftDto: MintNftDto, @Param('tokenId', ParseIntPipe) id: number): Promise<ResponseData> {
    return this.nftsService.mintNewToken(id, mintNftDto);
  }

  @ApiOperation({
    summary: 'Get detail information about NFT token.',
    description: ''
  })
  @ApiTags('admin')
  @Get('token/:tokenId')
  @ApiResponse({ status: 201, description: 'token items.' })
  @ApiResponse({ status: 404, description: 'token not found.' })
  @ApiResponse({ status: 400, description: 'invalid input' })
  @ApiResponse({ status: 409, description: 'no tokens.' })
  @ApiResponse({ status: 500, description: 'unexpected error.' })
  findOne(@Param('tokenId', ParseIntPipe) id: number): Promise<ResponseData> {
    return this.nftsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Transfer NFT token to another address.',
    description: ''
  })
  @ApiTags('admin')
  @Post('transfer/:tokenId/:userAddress')
  transfer(@Param('tokenId', ParseIntPipe) id: number, @Param('userAddress') receiver: string): Promise<ResponseData> {
    return this.nftsService.transferNft(id, receiver);
  }

  @ApiOperation({
    summary: 'Migrate NFT token to another network.',
    description: 'At the moment only transfer between Ethereum and Matic networks are supported.'
  })
  @ApiTags('admin')
  @Post('token/:tokenId/migrate')
  migrate(@Body() migrateNftDto: MigrateNftDto): Promise<ResponseData> {
    return this.nftsService.migrateNft(migrateNftDto);
  }

  @ApiOperation({
    summary: 'List all issued NFT token.',
    description: ''
  })
  @ApiTags('admin')
  @Get('list')
  findAll(): Promise<ResponseData> {
    return this.nftsService.findAll();
  }

  @ApiOperation({
    summary: 'Get token balance of {address}.',
    description: ''
  })
  @Get('/balance/:tokenId/:address')
  checkBalance(@Param('tokenId', ParseIntPipe) id: number, @Param('address') address: string): Promise<ResponseData> {
    return this.nftsService.checkBalance(id, address);
  }

  @ApiOperation({
    summary: 'Get list of current owners of this NFT.',
    description: ''
  })
  @Get('/token/:tokenId/owners')
  findTokenOwners(@Param('tokenId', ParseIntPipe) id: number): Promise<ResponseData> {
    return this.nftsService.fetchTokenHolders(id);
  }

  @ApiOperation({
    summary: 'List currently issued editions of a NFT.',
    description: ''
  })
  @Get('/token/:tokenId/editions')
  findTokenEditions(@Param('tokenId', ParseIntPipe) id: number): Promise<ResponseData> {
    return this.nftsService.fetchTokenEditions(id);
  }

  @ApiOperation({
    summary: 'Get address of currently set privatekey/mnemonic.',
    description: ''
  })
  @Get('/address')
  @ApiQuery({ name: 'balance', enum: Balance })
  getAdminAddress(@Query('balance') balance: Balance = Balance.default): Promise<ResponseData> {
    return this.nftsService.getAdminAddress(balance);
  }

  @ApiOperation({
    summary: 'Get NFT metadata.',
    description: ''
  })
  @Get('/nfts/:tokenId')
  getMetadata(@Param('tokenId') id: string): Promise<ResponseData> {
    return this.nftsService.getMetadata(id);
  }

  @ApiOperation({
    summary: 'Get logs file',
    description: ''
  })
  @Get('/log')
  async getLogs(@Res() response: Response): Promise<any> {
    const filename = __dirname + '/../../../errors.log';
    const readStream = await fs.createReadStream(filename);
    response.set({
      'Content-Type': 'multipart/form-data',
    });

    // This just pipes the read stream to the response object (which goes to the client)
    return readStream.pipe(response);
  }
}
