import { Controller, Body, Get, Param, Post, UseInterceptors, UploadedFile, ParseIntPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateNftDto } from './dto/create-nft.dto';
import { MigrateNftDto } from './dto/migrate-nft.dto';
import { TransferNftDto } from './dto/transfer-nft.dto';
import { Nft, ResponseData } from './interfaces/nft.interface';
import { NftsService } from './nfts.service';

@Controller()
export class NftsController {
  constructor(private readonly nftsService: NftsService) { }

  @ApiTags('admin')
  @Post('create')
  @ApiResponse({ status: 201, description: 'item created.'})
  @ApiResponse({ status: 400, description: 'invalid input.'})
  @ApiResponse({ status: 409, description: 'an existing token already exists.'})
  @ApiResponse({ status: 500, description: 'Unexpected error.'})
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateNftDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  create(@Body() createNftDto: CreateNftDto, @UploadedFile() file: Express.Multer.File): Promise<ResponseData> {
    return this.nftsService.create(createNftDto, file.buffer);
  }

  @ApiTags('admin')
  @Get('token/:tokenId')
  findOne(@Param('tokenId', ParseIntPipe) id: number): Promise<ResponseData> {
    return this.nftsService.findOne(id);
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

  @ApiTags('admin')
  @Post('transfer')
  transfer(@Body() transferNftDto: TransferNftDto): Promise<ResponseData> {
    return this.nftsService.transferNft(transferNftDto);
  }
}
