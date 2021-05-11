export interface Nft {
    id?: string,
    network?: string,
    nftID?: number,
    ipfsHash?: string,
    name: string,
    author: string,
    owner?: string,
    about: string,
    editions?: number
    price?: number
    properties?: object
    statement?: object
    circulatingSupply?: number,
}

export interface TransferNft {
    network: string,
    fee?: number
}

export interface MigrateNft {
    fromNetwork: string,
    toNetwork: string,
    tokenid: number,
    owner: string
}

export interface ResponseData {
    success: boolean,
    message: string,
    data: object,
    transactionHash: string
}

export interface MintNft {
    network: string,
    fee?: string,
    toAddress: string,
    amount: number,
}

export interface NftDAOWhereClause {
    network?: string,
    address?: string,
}
export interface NftDAO {
    findAll(whereClause?: NftDAOWhereClause, contractId?: string): Promise<Nft[]>;
    findOne(id: number, network?: string, contractId?: string): Promise<Nft>;
    create(nft: Nft, contractId?: string): Promise<Nft>;
}