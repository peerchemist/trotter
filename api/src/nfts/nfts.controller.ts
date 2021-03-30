import { Controller, Body, Get, Param, Post } from '@nestjs/common';
import { CreateNftDto } from './dto/create-nft.dto';
import { Nft } from './interfaces/nft.interface';
import { NftsService } from './nfts.service';

@Controller('nfts')
export class NftsController {
    constructor(private readonly nftsService: NftsService) { }

    @Get(':id')
    findOne(@Param('id') id): Promise<Nft>  {
      return this.nftsService.findOne(id);
    }

    @Post()
    create(@Body() createNftDto: CreateNftDto): Promise<Nft> {
        return this.nftsService.create(createNftDto);
    }
}
