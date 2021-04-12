import Web3 from 'src/utils/web3';
import * as trotterNftAbi from '../config/abi/trotterNft.json';
import contracts from 'src/config/contracts';
import { Nft } from 'src/models/interfaces/nft.interface';

export const getContract = async (network?: string): Promise<any[]> => {
    const usenetwork = network && contracts.trotterNft[network] && process.env[network] ? network : 'API_MATIC_TESTNET';
    console.log({usenetwork});
    
    const web3 = Web3(usenetwork)
    const accounts: string[] = await web3.eth.getAccounts();
    const contractAddress = contracts.trotterNft[usenetwork];
    const nftContract: any = new web3.eth.Contract(trotterNftAbi, contractAddress);

    return [accounts[0], nftContract, usenetwork];
}

export const createNFT = async (nft: Nft): Promise<any> => {
    const [account, nftContract]: any[] = await getContract(nft.network);
    const nftData = { name: nft.name, ipfsHash: nft.ipfsHash, price: nft.price, author: nft.author, about: nft.about, properties: JSON.stringify(nft.properties || ''), statement: JSON.stringify(nft.statement || '') };
    return await nftContract.methods.createNftCard(nftData, account, nft.editions, 1).send({ from: account, gas: "1000000" });
}

export const transferNFT = async (network: string, from: string, to: string, nftID: number): Promise<any> => {
    try {
        const [account, nftContract]: any[] = await getContract(network);
        return await nftContract.methods.safeTransferFrom(from, to, nftID, 1, Buffer.alloc(0, "binary")).send({ from: account });
    } catch (error) {
        throw new Error("Can't transfer NFT please check balance");
        
    }
}

export const migrateNFT = async (fromNetwork: string, toNetwork: string, nftID: number): Promise<any> => {
    const [account, nftContract]: any[] = await getContract(fromNetwork);
    // return await nftContract.methods.safeTransferFrom(fromNetwork, toNetwork, nftID, 1).send({ from: account });
}

export const structResponse = (nft: any, id: number, network?: string) => {
    return {
        network,
        nftID: id,
        name: nft['name'],
        owner: nft['owner'],
        ipfsHash: nft['ipfsHash'],
        price: nft['price'],
        author: nft['author'],
        about: nft['about'],
        properties: JSON.parse(nft['properties']),
        statement: JSON.parse(nft['statement']),
    }
}

export const fetchNFTs = async (): Promise<any> => {
    const [account, nftContract, network]: any[] = await getContract();
    const res = await nftContract.methods.fetchNfts().call({ from: account });
    const data = res.map((nft, index) => {
        const nftObj = { ...nft, owner: account };
        return structResponse(nftObj, index+1, network);
    })

    return data
}

export const getNFT = async (id: number): Promise<any> => {
    const [account, nftContract, network]: any[] = await getContract();
    try {
        const res = await nftContract.methods.getNft(id).call({ from: account });
        const nftObj = { ...res, owner: account }
        return structResponse(nftObj, id, network);
    } catch (error) {
        return {}
    }
}
