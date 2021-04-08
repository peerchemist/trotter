import Web3 from 'src/utils/web3';
import * as trotterNftAbi from '../config/abi/trotterNft.json';
import contracts from 'src/config/contracts';
import { Nft } from 'src/nfts/interfaces/nft.interface';

export const getContract = async (network?: string): Promise<any[]> => {
    const usenetwork = network && contracts.trotterNft[network] && process.env[network] ? network : 'MATIC_TESTNET';
    const web3 = Web3(usenetwork)
    const accounts: string[] = await web3.eth.getAccounts();
    const contractAddress = contracts.trotterNft[usenetwork]
    const nftContract: any = new web3.eth.Contract(trotterNftAbi, contractAddress);

    return [accounts[0], nftContract];
}

export const createNFT = async (nft: Nft): Promise<any> => {
    const [account, nftContract]: any[] = await getContract(nft.network);
    
    return await nftContract.methods.createNftCard(nft.name, nft.ipfsHash, nft.price, nft.editions, 1).send({ from: account, gas: "1000000" });
}

export const transferNFT = async (network: string, from: string, to: string, nftID: number): Promise<any> => {
    const [account, nftContract]: any[] = await getContract(network);
    return await nftContract.methods.safeTransferFrom(from, to, nftID, 1).send({ from: account });
}

export const migrateNFT = async (fromNetwork: string, toNetwork: string, nftID: number): Promise<any> => {
    const [account, nftContract]: any[] = await getContract(fromNetwork);
    // return await nftContract.methods.safeTransferFrom(fromNetwork, toNetwork, nftID, 1).send({ from: account });
}

export const fetchNFTs = async (): Promise<any> => {
    const [account, nftContract]: any[] = await getContract();
    const res = await nftContract.methods.fetchNfts().call({ from: account });
    const data = res.map(nft => {
        return {
            name: nft['name'],
            ipfsHash: nft['ipfsHash'],
            price: nft['price'],
        }
    })
    
    return data
}

export const getNFT = async (id: number): Promise<any> => {
    const [account, nftContract]: any[] = await getContract();
    try {
        const res = await nftContract.methods.getNft(id).call({ from: account });
        return {
            name: res['name'],
            ipfsHash: res['ipfsHash'],
            price: res['price'],
        }
    } catch (error) {
        return {}
    }
}
