import Web3 from 'src/utils/web3';
import * as trotterNftAbi from '../config/abi/trotterNftErc721.json';
import { Nft } from 'src/models/interfaces/nft.interface';
import { structNftResponse } from './response';
import config from '../config/config';

export const getContract = async (network?: string): Promise<any[]> => {
    const defaultNetwork = config.networks.DEFAULT_NETWORK.replace('API_', '');
    const contracts = config.contracts;
    const usenetwork = network && contracts[network] && config.networks[network] ? network : defaultNetwork;
    console.log({usenetwork});
    
    const web3 = Web3(usenetwork)
    const gasPrice = await web3.eth.getGasPrice()
    const accounts: string[] = await web3.eth.getAccounts();
    // get transaction count for this wallet
    const nonce = await web3.eth.getTransactionCount(accounts[0])
    const contractAddress = contracts[usenetwork];
    const nftContract: any = new web3.eth.Contract(trotterNftAbi, contractAddress);
    
    return [accounts[0], nftContract, usenetwork, contractAddress, nonce, gasPrice];
}

export const createErc721 = async (nft: Nft): Promise<any> => {
    const [account, nftContract, , , nonce, gasPrice]: any[] = await getContract(nft.network);
    const nftData = [nft.name, nft.ipfsHash, nft.price, nft.author, nft.about, JSON.stringify(nft.properties || ''), JSON.stringify(nft.statement || '')];    
    return await nftContract.methods.createNft(...nftData, account).send({ from: account, gasPrice, gas: '1000000', nonce });
}

export const transferErc721 = async (network: string, to: string, nftID: number): Promise<any> => {
    const [account, nftContract, , , nonce]: any[] = await getContract(network);
    return await nftContract.methods.transferFrom(account, to, nftID).send({ from: account, nonce });
}

export const fetchErc721s = async (usenetwork?: string): Promise<any> => {
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

export const fetchErc721Holders = async (id): Promise<any> => {
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

export const getErc721 = async (id: number, useNetwork?: string): Promise<any> => {
    const [account, nftContract, network, contractAddress]: any[] = await getContract(useNetwork);
    const res = await nftContract.methods.nfts(id - 1).call();
    const owner = await nftContract.methods.nftOwner(id).call();
    const nftObj = { ...res, contractAddress, owner }
    return structNftResponse(nftObj, network);
}

export const checkErc721Balance = async (address: string): Promise<any> => {
    const [account, nftContract, network, contractAddress]: any[] = await getContract();
    const res = await nftContract.methods.balanceOf(address).call();
    return {
        network,
        contractAddress,
        address,
        balance: res,
    };
}
