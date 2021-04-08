import { ResponseData } from "src/nfts/interfaces/nft.interface"

const Response = (data: object, message: string, success?: boolean, transactionHash?: string): ResponseData => {
    return {
        success: success ? success : true,
        message,
        data,
        transactionHash
    }
}

export default Response
