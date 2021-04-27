import Web3 from 'src/utils/web3';
import * as trotterNftAbi from '../config/abi/trotterNft.json';
import { Nft } from 'src/models/interfaces/nft.interface';
import { structNftResponse } from './response';
import { getContract } from './contractHelper';
import config from '../config/config';

export const createNFT = async (nft: Nft): Promise<any> => {
    const [account, nftContract, , , nonce, gasPrice]: any[] = await getContract(nft.network);
    const nftData = [nft.name, nft.ipfsHash, nft.price, nft.author, nft.about, JSON.stringify(nft.properties || ''), JSON.stringify(nft.statement || '')];    
    return await nftContract.methods.createNftCard(...nftData, account).send({ from: account, gasPrice, gas: '1000000', nonce });
}

export const transferNFT = async (network: string, to: string, nftID: number): Promise<any> => {
    const [account, nftContract, , , nonce]: any[] = await getContract(network);
    return await nftContract.methods.transfer(account, to, nftID).send({ from: account, nonce });
}

export const fetchNFTs = async (usenetwork?: string): Promise<any> => {
    const [account, nftContract, network, contractAddress]: any[] = await getContract(usenetwork);
    const cards = await nftContract.methods.nftIds().call({ from: account });

    const nfts = [];
    const owners = [];

    for (let i = 0; i < cards; i++) {
        nfts.push(nftContract.methods.nfts(i).call({ from: account }));
        owners.push(nftContract.methods.nftOwner(i + 1).call());
    }

    const resNfts = await Promise.all(nfts);
    const resOwners = await Promise.all(owners);

    return resNfts.map((nft, index) => {
        const newObj = { ...nft, contractAddress, owner: resOwners[index] };
        return structNftResponse(newObj, network);
    });
}

export const fetchNFTHolders = async (id): Promise<any> => {
    const [account, nftContract, network, contractAddress]: any[] = await getContract();

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
            res.push({ address: resholders[i], balance, network, contractAddress });
        }
    }
    
    return res;
}

export const getNFT = async (id: number, useNetwork?: string): Promise<any> => {
    const [account, nftContract, network, contractAddress]: any[] = await getContract(useNetwork);
    const res = await nftContract.methods.nfts(id - 1).call({ from: account });
    const nftObj = { ...res, contractAddress }
    return structNftResponse(nftObj, network);
}

export const checkNFTBalance = async (id: number, address: string): Promise<any> => {
    const [account, nftContract, network, contractAddress]: any[] = await getContract();
    const res = await nftContract.methods.balanceOf(address, id).call();
    return {
        network,
        contractAddress,
        address,
        balance: res,
    };
}
