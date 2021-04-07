import { Controller, Body, Get, Param, Post, UseInterceptors, UploadedFile, ParseIntPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateNftDto } from './dto/create-nft.dto';
import { MigrateNftDto } from './dto/migrate-nft.dto';
import { TransferNftDto } from './dto/transfer-nft.dto';
import { Nft } from './interfaces/nft.interface';
import { NftsService } from './nfts.service';

@Controller('nfts')
export class NftsController {
  constructor(private readonly nftsService: NftsService) { }

  @Post('create')
  @UseInterceptors(FileInterceptor('file'))
  create(@Body() createNftDto: CreateNftDto, @UploadedFile() file: Express.Multer.File): Promise<Nft> {
    return this.nftsService.create(createNftDto, file.buffer);
  }

  @Get('token/:tokenId')
  findOne(@Param('tokenId', ParseIntPipe) id: number): Promise<Nft> {
    return this.nftsService.findOne(id);
  }

  // @Post('token/:tokenId/migrate')
  // migrate(@Body() migrateNftDto: MigrateNftDto): Promise<Nft> {
  //   return this.nftsService.migrateNft(migrateNftDto);
  // }

  @Get('list')
  findAll(): Promise<Nft[]> {
    return this.nftsService.findAll();
  }

  @Post('transfer')
  transfer(@Body() transferNftDto: TransferNftDto): Promise<Nft> {
    return this.nftsService.transferNft(transferNftDto);
  }
}
