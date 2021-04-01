export interface Nft {
    id?: string,
    network: string,
    nftID?: string,
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