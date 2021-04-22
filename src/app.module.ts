import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import config from './config/config';
import { NftsModule } from './modules/nfts/nfts.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [NftsModule, MongooseModule.forRoot(config.mongoURI), ThrottlerModule.forRoot({
    ttl: 60,
    limit: 10
  })],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
  ],
})
export class AppModule {}
