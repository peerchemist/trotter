import web3 from 'src/utils/web3';
import * as trotterNftAbi from '../config/abi/trotterNft.json';
import contracts from 'src/config/contracts';
import { Nft } from 'src/nfts/interfaces/nft.interface';

export const getContract = async (): Promise<any[]> => {
    const accounts: string[] = await web3.eth.getAccounts();
    const nftContract: any = new web3.eth.Contract(trotterNftAbi, contracts.trotterNft);

    return [accounts[0], nftContract];
}

export const createNFT = async (nft: Nft): Promise<any> => {
    const [account, nftContract]: any[] = await getContract();
    return await nftContract.methods.createNftCard(nft.name, nft.ipfsHash, nft.price, nft.owner, nft.editions, 1).send({ from: account });
}

export const transferNFT = async (from: string, to: string, nftID: number): Promise<any> => {
    const [account, nftContract]: any[] = await getContract();
    return await nftContract.methods.safeTransferFrom(from, to, nftID, 1).send({ from: account });
}