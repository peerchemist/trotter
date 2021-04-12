import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NftsController } from './nfts.controller';
import { NftsService } from './nfts.service';
import { NftSchema } from './nft.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: "Nft", schema: NftSchema }])],
  controllers: [NftsController],
  providers: [NftsService],
})
export class NftsModule {}
