import web3 from 'src/utils/web3';
import * as trotterNftAbi from '../config/abi/trotterNft.json';
import contracts from 'src/config/contracts';
import { Nft } from 'src/nfts/interfaces/nft.interface';

const getContract = async (): Promise<any[]> => {
    const accounts: string[] = await web3.eth.getAccounts();
    const nftContract = new web3.eth.Contract(trotterNftAbi, contracts.trotterNft)

    return [accounts[0], nftContract];
}

const createNFT = async (nft: Nft) => {
    const [account, nftContract]: any[] = await getContract()
    await nftContract.methods.createNftCard(nft.name, nft.ipfsHash, nft.owner, nft.editions, 1).send({ from: account })
}