import Web3 from 'src/utils/web3';
import * as trotterNftAbi from '../config/abi/trotterNft.json';
import contracts from 'src/config/contracts';
import { Nft } from 'src/models/interfaces/nft.interface';
import { structNftResponse } from './response';

export const getContract = async (network?: string): Promise<any[]> => {
    const usenetwork = network && contracts.trotterNft[network] && process.env[network] ? network : 'API_LOCAL';
    console.log({usenetwork});
    
    const web3 = Web3(usenetwork)
    const accounts: string[] = await web3.eth.getAccounts();
    const contractAddress = contracts.trotterNft[usenetwork];
    const nftContract: any = new web3.eth.Contract(trotterNftAbi, contractAddress);

    return [accounts[0], nftContract, usenetwork];
}

export const createNFT = async (nft: Nft): Promise<any> => {
    const [account, nftContract]: any[] = await getContract(nft.network);
    // const nftData = { name: nft.name, ipfsHash: nft.ipfsHash, price: nft.price, author: nft.author, about: nft.about, properties: JSON.stringify(nft.properties || ''), statement: JSON.stringify(nft.statement || '') };
    const nftData = [nft.name, nft.ipfsHash, nft.price, nft.author, nft.about, JSON.stringify(nft.properties || ''), JSON.stringify(nft.statement || '')];
    console.log(nft.editions);
    
    return await nftContract.methods.createNftCard(...nftData, account, nft.editions, 1).send({ from: account, gas: "1000000" });
}

export const transferNFT = async (network: string, from: string, to: string, nftID: number): Promise<any> => {
    const [account, nftContract]: any[] = await getContract(network);
    return await nftContract.methods.transfer(from, to, nftID, 1).send({ from });
}

export const migrateNFT = async (fromNetwork: string, toNetwork: string, nftID: number): Promise<any> => {
    const [account, nftContract]: any[] = await getContract(fromNetwork);
    // return await nftContract.methods.transfer(fromNetwork, toNetwork, nftID, 1).send({ from: account });
}

export const fetchNFTs = async (): Promise<any> => {
    const [account, nftContract, network]: any[] = await getContract();
    const cards = await nftContract.methods.cards().call({ from: account });

    const nfts = [];
    const maxs = [];
    const circulatings = [];

    for (let i = 0; i < cards; i++) {
        nfts.push(nftContract.methods.nfts(i).call({ from: account }));
        maxs.push(nftContract.methods.totalSupply(i).call());
        circulatings.push(nftContract.methods.circulatingSupply(i).call());
    }
    
    const resMaxs = await Promise.all(maxs);
    const resCirculatings = await Promise.all(circulatings);
    const resNfts = await Promise.all(nfts);

    return resNfts.map((nft, index) => {
        const newObj = { ...nft, editions: resMaxs[index], circulatingSupply: resCirculatings[index] };
        return structNftResponse(newObj, network);
    });
}

export const fetchNFTHolders = async (id): Promise<any> => {
    const [account, nftContract, network]: any[] = await getContract();

    const holders = [];
    let moreHolder = true;
    let i = 0;
    while (moreHolder) {
        try {
            holders.push((await nftContract.methods.nftOwners(id, i).call({ from: account })));
            i++;
        } catch (error) {
            moreHolder = false;
        }
    }
    
    const resholders = await Promise.all(holders);
    const res = [];
    for (let i = 0; i < resholders.length; i++) {
        if (resholders[i] !== "0x0000000000000000000000000000000000000000" && !res.find(h => h.address == resholders[i])) {
            const balance = await nftContract.methods.balanceOf(resholders[i], id).call();
            res.push({ address: resholders[i], balance });
        }
    }
    
    return res;
}

export const getNFT = async (id: number): Promise<any> => {
    const [account, nftContract, network]: any[] = await getContract();
    const res = await nftContract.methods.nfts(id).call({ from: account });
    const nftObj = { ...res, owner: account }
    return structNftResponse(nftObj, network);
}

export const checkNFTBalance = async (id: number, address: string): Promise<any> => {
    const [account, nftContract, network]: any[] = await getContract();
    const res = await nftContract.methods.balanceOf(address, id).call();
    return {
        address,
        balance: res,
    };
}

export const mintNFT = async (network: string, nftID: number, to: string, amount: number): Promise<any> => {
    const [account, nftContract]: any[] = await getContract(network);
    return await nftContract.methods.mint(to, nftID, amount).send({ from: account });
}

export const fetchNFTEditions = async (id: number): Promise<any> => {
    const [account, nftContract, network]: any[] = await getContract();

    const nft = await nftContract.methods.getNft(id).call({ from: account });
    const holders = await fetchNFTHolders(id);

    const res = [];
    holders.map((holder) => {
        const newObj = { ...nft, owner: holder.address, balance: holder.balance };
        if (!res.find(h => h.owner == holder))
            res.push(structNftResponse(newObj, network));
    });

    return res;
}