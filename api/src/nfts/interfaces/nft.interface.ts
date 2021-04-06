export interface Nft {
    id?: string,
    network: string,
    nftID?: number,
    owner: string,
    ipfsHash?: string,
    name: string,
    author: string,
    about: string,
    editions: number
    price: number
    properties: object
    statement: object
    circulatingSupply?: number,
}

export interface TransferNft {
    network: string,
    tokenid: number,
    fee: number,
    from: string,
    destination: string,
}