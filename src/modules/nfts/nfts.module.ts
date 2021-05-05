import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NftsController } from './nfts.controller';
import { NftsService } from './nfts.service';
import { NftSchema } from './nft.schema';
import { MongoDB } from '../nfts/mongo.service';
import { FirestoreDB } from '../nfts/firestore.service';
import config from '../../config/config';

const dbClass = (() => {
  const supportedDialects = {
    mongo: MongoDB,
    firestore: FirestoreDB,
  };
  return supportedDialects[config.db.dialect];
})();
const NftDAOService = {
  provide: 'NftDAOService',
  useClass: dbClass,
};
@Module({
  imports: [MongooseModule.forFeature([{ name: "Nft", schema: NftSchema }])],
  controllers: [NftsController],
  providers: [NftsService, NftDAOService],
})
export class NftsModule { }
