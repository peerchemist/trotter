import { Controller, Body, Get, Param, Post, UseInterceptors, UploadedFile, ParseIntPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateNftDto, MigrateNftDto, MintNftDto, TransferNftDto } from '../../models/dtos/nft.dto';
import { ResponseData } from '../../models/interfaces/nft.interface';
import { NftsService } from './nfts.service';

@Controller()
export class NftsController {
  constructor(private readonly nftsService: NftsService) { }

  @ApiOperation({
    summary: 'create a NFT token',
    description: 'Create NFT token on a $BLOCKCHAIN by passing required metadata'
  })
  @ApiTags('admin')
  @Post('create')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateNftDto,
  })
  @ApiResponse({ status: 201, description: 'item created'})
  @ApiResponse({ status: 400, description: 'invalid input | {msg}'})
  @ApiResponse({ status: 409, description: 'an existing token already exists.'})
  @ApiResponse({ status: 500, description: 'unexpected error.'})
  @UseInterceptors(FileInterceptor('file'))
  create(@Body() createNftDto: CreateNftDto, @UploadedFile() file: Express.Multer.File): Promise<ResponseData> {
    return this.nftsService.create(createNftDto, file.buffer);
  }

  @ApiOperation({
    summary: '',
    description: ''
  })
  @ApiTags('admin')
  @Post('/token/:tokenId/mint')
  mintNewToken(@Body() mintNftDto: MintNftDto, @Param('tokenId', ParseIntPipe) id: number): Promise<ResponseData> {
    return this.nftsService.mintNewToken(id, mintNftDto);
  }

  @ApiOperation({
    summary: '',
    description: ''
  })
  @ApiTags('admin')
  @Get('token/:tokenId')
  @ApiResponse({ status: 201, description: 'token items.'})
  @ApiResponse({ status: 404, description: 'token not found.'})
  @ApiResponse({ status: 400, description: 'invalid input'})
  @ApiResponse({ status: 409, description: 'no tokens.' })
  @ApiResponse({ status: 500, description: 'unexpected error.'})
  findOne(@Param('tokenId', ParseIntPipe) id: number): Promise<ResponseData> {
    return this.nftsService.findOne(id);
  }

  @ApiOperation({
    summary: '',
    description: ''
  })
  @ApiTags('admin')
  @Post('transfer/:tokenId')
  transfer(@Body() transferNftDto: TransferNftDto, @Param('tokenId', ParseIntPipe) id: number): Promise<ResponseData> {
    return this.nftsService.transferNft(transferNftDto, id);
  }

  @ApiOperation({
    summary: '',
    description: ''
  })
  @ApiTags('admin')
  @Post('token/:tokenId/migrate')
  migrate(@Body() migrateNftDto: MigrateNftDto): Promise<ResponseData> {
    return this.nftsService.migrateNft(migrateNftDto);
  }

  @ApiOperation({
    summary: '',
    description: ''
  })
  @ApiTags('admin')
  @Get('list')
  findAll(): Promise<ResponseData> {
    return this.nftsService.findAll();
  }

  @ApiOperation({
    summary: '',
    description: ''
  })
  @Get('/balance/:tokenId/:address')
  checkBalance(@Param('tokenId', ParseIntPipe) id: number, @Param('address') address: string): Promise<ResponseData> {
    return this.nftsService.checkBalance(id, address);
  }

  @ApiOperation({
    summary: '',
    description: ''
  })
  @Get('/token/:tokenId/owners')
  findTokenOwners(@Param('tokenId', ParseIntPipe) id: number): Promise<ResponseData> {
    return this.nftsService.fetchTokenHolders(id);
  }

  @ApiOperation({
    summary: '',
    description: ''
  })
  @Get('/token/:tokenId/editions')
  findTokenEditions(@Param('tokenId', ParseIntPipe) id: number): Promise<ResponseData> {
    return this.nftsService.fetchTokenEditions(id);
  }

  @ApiOperation({
    summary: '',
    description: ''
  })
  @Post('/mnemonic/:key')
  changeMnemonic(@Param('key') key: string): Promise<ResponseData> {
    return this.nftsService.changeMnemonic(key);
  }

  @ApiOperation({
    summary: '',
    description: ''
  })
  @Get('/address/')
  getAdminAddress(): Promise<ResponseData> {
    return this.nftsService.getAdminAddress();
  }
}
