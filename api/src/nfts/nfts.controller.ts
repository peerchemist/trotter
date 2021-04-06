import { Controller, Body, Get, Param, Post, UseInterceptors, UploadedFile, ParseIntPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateNftDto } from './dto/create-nft.dto';
import { Nft } from './interfaces/nft.interface';
import { NftsService } from './nfts.service';

@Controller('nfts')
export class NftsController {
  constructor(private readonly nftsService: NftsService) { }

  @Get(':nftID')
  findOne(@Param('nftID', ParseIntPipe) id: number): Promise<Nft> {
    return this.nftsService.findOne(id);
  }

  @Get()
  findAll(): Promise<Nft[]> {
    return this.nftsService.findAll();
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@Body() createNftDto: CreateNftDto, @UploadedFile() file: Express.Multer.File): Promise<Nft> {
    return this.nftsService.create(createNftDto, file.buffer);
  }

  @Post('generateQRCode/:nftID')
  generateQrCode(@Param('nftID', ParseIntPipe) id: number): Promise<String> {
    return this.nftsService.createQrCode(id)
  }
}
