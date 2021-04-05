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