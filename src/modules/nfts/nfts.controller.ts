import { Controller, Body, Get, Param, Post, UseInterceptors, UploadedFile, ParseIntPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateNftDto, MigrateNftDto, TransferNftDto } from '../../models/dtos/nft.dto';
import { ResponseData } from '../../models/interfaces/nft.interface';
import { NftsService } from './nfts.service';

@Controller()
export class NftsController {
  constructor(private readonly nftsService: NftsService) { }

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

  @ApiTags('admin')
  @Post('transfer')
  transfer(@Body() transferNftDto: TransferNftDto): Promise<ResponseData> {
    return this.nftsService.transferNft(transferNftDto);
  }

  @ApiTags('admin')
  @Post('token/:tokenId/migrate')
  migrate(@Body() migrateNftDto: MigrateNftDto): Promise<ResponseData> {
    return this.nftsService.migrateNft(migrateNftDto);
  }

  @ApiTags('admin')
  @Get('list')
  findAll(): Promise<ResponseData> {
    return this.nftsService.findAll();
  }

  @Get('/balance/:tokenId/:address')
  checkBalance(@Param('tokenId', ParseIntPipe) id: number, @Param('address') address: string): Promise<ResponseData> {
    return this.nftsService.checkBalance(id, address);
  }

  @Get('/token/:tokenId/owners')
  findTokenOwners(@Param('tokenId', ParseIntPipe) id: number): Promise<ResponseData> {
    return this.nftsService.fetchTokenHolders(id);
  }

  @Get('/token/:tokenId/editions')
  findTokenEditions(@Param('tokenId', ParseIntPipe) id: number): Promise<ResponseData> {
    return this.nftsService.findAll();
  }
}
