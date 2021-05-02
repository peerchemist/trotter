import { Nft } from 'src/models/interfaces/nft.interface';
export declare const getContract: (network: string) => Promise<any[]>;
export declare const createErc721: (network: any, nft: Nft) => Promise<any>;
export declare const transferErc721: (network: string, to: string, nftID: number) => Promise<any>;
export declare const fetchErc721s: (usenetwork?: string) => Promise<any>;
export declare const getErc721: (network: string, id: number) => Promise<any>;
export declare const checkErc721Balance: (network: string, address: string) => Promise<any>;
