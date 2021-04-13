import { HttpException, Res } from "@nestjs/common"
import { ResponseData } from "src/models/interfaces/nft.interface"

export const response = (data: object, message: string, success?: boolean, transactionHash?: string): ResponseData => {
    return {
        success: success ? success : false,
        message,
        data,
        transactionHash
    }
}

export const structNftResponse = (nft: any, network?: string) => {
    return {
        network,
        nftID: nft['nftID'],
        name: nft['name'],
        ipfsHash: nft['ipfsHash'],
        price: nft['price'],
        author: nft['author'],
        owner: nft['owner'],
        balance: nft['balance'],
        editions: nft['editions'],
        circulatingSupply: nft['circulatingSupply'],
        about: nft['about'],
        properties: JSON.parse(nft['properties']),
        statement: JSON.parse(nft['statement']),
    }
}

export const nftResponse = (errMessage: string) => {
    const errorMsgs = [
        { msg: 'Initial supply less than 1', status: 400 },
        { msg: 'Maximum supply can not be 0', status: 400 },
        { msg: 'Caller is not a minter', status: 401 },
        { msg: 'Total supply reached', status: 400 },
        { msg: 'ERC1155: balance query for the zero address', status: 400 },
        { msg: 'ERC1155: insufficient balance for transfer', status: 400 },
        { msg: 'ERC1155: caller is not owner nor approved', status: 400 },
        { msg: 'ERC1155: balance query for the zero address', status: 400 },
    ];

    const resMsg = errorMsgs.find(msg => errMessage.includes(msg.msg) || errMessage == msg.msg)

    console.log(errMessage);
    
    if (!resMsg || !resMsg.msg)
        throw new HttpException({
            status: 500,
            success: false,
            message: "unexpected error",
        }, 500);
    
    throw new HttpException({
        status: resMsg.status,
        success: false,
        message: resMsg.msg,
    }, resMsg.status);
}