import { ResponseData } from "src/models/interfaces/nft.interface";
export declare const response: (data: object, message: string, success?: boolean, transactionHash?: string) => ResponseData;
export declare const structNftResponse: (nft: any, network?: string) => {
    network: string;
    contractAddress: any;
    nftID: any;
    name: any;
    ipfsHash: any;
    price: any;
    author: any;
    owner: any;
    balance: any;
    editions: any;
    circulatingSupply: any;
    about: any;
    description: any;
    properties: any;
    statement: any;
};
export declare const nftResponse: (errMessage: string) => never;
