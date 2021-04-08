import { ResponseData } from "src/nfts/interfaces/nft.interface"

const Response = (data: object, message: string, success?: boolean): ResponseData => {
    return {
        success: success ? success : true,
        message,
        data,
    }
}

export default Response
