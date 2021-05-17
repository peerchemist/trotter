/**
 * Service for communicating with Google Firestore
 * Setup will require environment variables mentioned in config file under db/firestore section
 * API Documentation for Firestore client -> https://googleapis.dev/nodejs/firestore/latest/
 * */
import { Injectable } from '@nestjs/common';
import { Nft } from '../../models/interfaces/nft.interface';
import { Firestore } from '@google-cloud/firestore';
import {
  NftDAO,
  NftDAOWhereClause
} from '../../models/interfaces/nft.interface';
import config from 'src/config/config';
import path from 'path';

@Injectable()
export class FirestoreDB implements NftDAO {
  private readonly firestore: Firestore;

  constructor() {
    this.firestore = new Firestore({
      projectId: config.db.firestore.projectId,
      keyFilename: path.resolve(config.db.firestore.serviceAccountPath),
    });
  }

  async findOne(
    id: number,
    network: string,
    contractId = config.db.firestore.defaultCollectionId,
  ) {
    const collectionRef = this.firestore.collection(contractId);
    if (network) {
      collectionRef.where('network', '==', network);
    }
    if (id) {
      collectionRef.where('nftID', '==', id);
    }
    const collectionData = await collectionRef.get();

    return (
      (collectionData.docs[0] && (collectionData.docs[0].data() as Nft)) || null
    );
  }

  _createWhereClause(collection, whereClause: NftDAOWhereClause) {
    for (const clause in whereClause) {
      collection = collection.where(clause, '==', whereClause[clause]);
    }

    return collection;
  }

  async findAll(
    whereClause: NftDAOWhereClause,
    contractId = config.db.firestore.defaultCollectionId
  ) {
    const collection = await this.firestore.collection(contractId);
    const result = await this._createWhereClause(collection, whereClause).get();

    return result.docs.map((doc) => doc.data() as Nft);
  }

  async create(nft: Nft, contractId = config.db.firestore.defaultCollectionId) {
    const document = this.firestore.doc(`${contractId}/${nft.id}`);
    await document.set(nft);

    return nft;
  }

  async updateById(
    id: number,
    { network, owner },
    contractId = config.db.firestore.defaultCollectionId
  ) {
    const collectionRef = this.firestore.collection(contractId);
    collectionRef.where('nftID', '==', id);
    const collectionData = await collectionRef.get();
    const model = collectionData.docs[0];

    if (!model) {
      throw new Error('Nft not found');
    }

    const modelData = model.data();
    await model.ref.update({
      network: network || modelData.network,
      owner: owner || modelData.owner
    });

    return model.data() as Nft;
  }
}
