"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nftResponse = exports.structNftResponse = exports.response = void 0;
const common_1 = require("@nestjs/common");
const nft_interface_1 = require("../models/interfaces/nft.interface");
const response = (data, message, success, transactionHash) => {
    return {
        success: success ? success : false,
        message,
        data,
        transactionHash
    };
};
exports.response = response;
const structNftResponse = (nft, network) => {
    return {
        network,
        contractAddress: network && nft['contractAddress'],
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
        description: nft['description'],
        properties: JSON.parse(nft['properties']),
        statement: JSON.parse(nft['statement']),
    };
};
exports.structNftResponse = structNftResponse;
const nftResponse = (errMessage) => {
    const errorMsgs = [
        { msg: 'Initial supply less than 1', status: 400 },
        { msg: 'Maximum supply can not be 0', status: 400 },
        { msg: 'Caller is not a minter', status: 401 },
        { msg: 'Total supply reached', status: 400 },
        { msg: 'ERC1155: balance query for the zero address', status: 400 },
        { msg: 'ERC1155: insufficient balance for transfer', status: 400 },
        { msg: 'ERC1155: caller is not owner nor approved', status: 400 },
        { msg: 'ERC1155: balance query for the zero address', status: 400 },
        { msg: 'value out-of-bounds', status: 400 },
        { msg: 'invalid BigNumber string', status: 400 },
        { msg: 'ERC721: transfer caller is not owner nor approved', status: 400 },
        { msg: 'insufficient funds for gas * price + value', status: 400 },
    ];
    const resMsg = errorMsgs.find(msg => errMessage.includes(msg.msg) || errMessage == msg.msg);
    console.log(errMessage);
    if (!resMsg || !resMsg.msg)
        throw new common_1.HttpException({
            status: 500,
            success: false,
            message: "unexpected error",
        }, 500);
    throw new common_1.HttpException({
        status: resMsg.status,
        success: false,
        message: resMsg.msg,
    }, resMsg.status);
};
exports.nftResponse = nftResponse;
//# sourceMappingURL=response.js.map