import { Controller, Body, Get, Param, Post, UseInterceptors, UploadedFile, ParseIntPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
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