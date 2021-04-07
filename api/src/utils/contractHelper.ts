import Web3 from 'src/utils/web3';
import * as trotterNftAbi from '../config/abi/trotterNft.json';
import contracts from 'src/config/contracts';
import { Nft } from 'src/nfts/interfaces/nft.interface';

export const getContract = async (network?: string): Promise<any[]> => {
    const web3 = Web3(network)
    const accounts: string[] = await web3.eth.getAccounts();
    const contractAddress = (network && contracts.trotterNft[network]) ? contracts.trotterNft[network] : contracts.trotterNft['BSC_TESTNET']
    const nftContract: any = new web3.eth.Contract(trotterNftAbi, contractAddress);

    return [accounts[0], nftContract];
}

export const createNFT = async (nft: Nft): Promise<any> => {
    const [account, nftContract]: any[] = await getContract(nft.network);
    
    return await nftContract.methods.createNftCard(nft.name, nft.ipfsHash, nft.price, nft.owner, nft.editions, 1).send({ from: account, gas: "1000000" });
}

export const transferNFT = async (network: string, from: string, to: string, nftID: number): Promise<any> => {
    const [account, nftContract]: any[] = await getContract(network);
    return await nftContract.methods.safeTransferFrom(from, to, nftID, 1).send({ from: account });
}

export const migrateNFT = async (fromNetwork: string, toNetwork: string, nftID: number): Promise<any> => {
    const [account, nftContract]: any[] = await getContract(fromNetwork);
    // return await nftContract.methods.safeTransferFrom(fromNetwork, toNetwork, nftID, 1).send({ from: account });
}