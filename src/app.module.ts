import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import config from './config/config';
import { NftsModule } from './modules/nfts/nfts.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [NftsModule, MongooseModule.forRoot(config.mongoURI), ThrottlerModule.forRoot({
    ttl: parseInt(config.throttler.ttl),
    limit: parseInt(config.throttler.limit)
  })],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
  ],
})
export class AppModule {}
