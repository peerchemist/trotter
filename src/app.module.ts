import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import config from './config/config';
import { NftsModule } from './modules/nfts/nfts.module';

@Module({
  imports: [NftsModule, MongooseModule.forRoot(config.mongoURI)]
})
export class AppModule {}
