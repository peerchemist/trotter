import Web3 from 'src/utils/web3';
import * as trotterNftAbi from '../config/abi/trotterNft.json';
import { Nft } from 'src/models/interfaces/nft.interface';
import { structNftResponse } from './response';
import config from '../config/config';

export const getContract = async (network: string): Promise<any[]> => {
    const defaultNetwork = config.networks.DEFAULT_NETWORK.replace('API_', '');
    const contracts = config.contracts;
    const usenetwork = contracts[network] && config.networks[network] ? network : defaultNetwork;
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

export const isErc721 = async (network: string): Promise<Boolean> => {
    if (network && config.listedNetworks[network] === 'erc721')
        return true;
    
    return false;
}

export const createNFT = async (network, nft: Nft): Promise<any> => {
    const [account, nftContract, usenetwork, , nonce, gasPrice]: any[] = await getContract(nft.network);
    const nftData = [nft.name, nft.ipfsHash, nft.price, nft.author, nft.about, JSON.stringify(nft.properties || ''), JSON.stringify(nft.statement || '')];  
    return await nftContract.methods.createNftCard(...nftData, account, nft.editions, 1).send({ from: account, gasPrice, gas: '1000000', nonce });
}

export const transferNFT = async (network: string, to: string, nftID: number): Promise<any> => {
    const [account, nftContract, , , nonce]: any[] = await getContract(network);
    return await nftContract.methods.transfer(account, to, nftID, 1).send({ from: account, nonce });
}

export const migrateNFT = async (fromNetwork: string, toNetwork: string, nftID: number): Promise<any> => {
    const [account, nftContract]: any[] = await getContract(fromNetwork);
    // return await nftContract.methods.transfer(fromNetwork, toNetwork, nftID, 1).send({ from: account });
}

export const fetchNFTs = async (usenetwork?: string): Promise<any> => {
    const [account, nftContract, network, contractAddress]: any[] = await getContract(usenetwork);
    const cards = await nftContract.methods.cards().call({ from: account });

    const nfts = [];
    const maxs = [];
    const circulatings = [];
    const balances = [];

    for (let i = 0; i < cards; i++) {
        balances.push(nftContract.methods.balanceOf(account, i + 1).call());
        nfts.push(nftContract.methods.nfts(i).call({ from: account }));
        maxs.push(nftContract.methods.totalSupply(i + 1).call());
        circulatings.push(nftContract.methods.circulatingSupply(i + 1).call());
    }
    
    const resMaxs = await Promise.all(maxs);
    const resCirculatings = await Promise.all(circulatings);
    const resNfts = await Promise.all(nfts);
    const resBalances = await Promise.all(balances);

    return resNfts.map((nft, index) => {
        const adminBalance = resBalances[index] > 0 ? resBalances[index] : undefined;
        const newObj = { ...nft, editions: resMaxs[index], circulatingSupply: resCirculatings[index], contractAddress, balance: adminBalance };
        return structNftResponse(newObj, network);
    });
}

export const fetchNFTHolders = async (network, id): Promise<any> => {
    const [account, nftContract, , contractAddress]: any[] = await getContract(network);

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

export const getNFT = async (network: string, id: number): Promise<any> => {
    const [account, nftContract, , contractAddress]: any[] = await getContract(network);
    const res = await nftContract.methods.nfts(id - 1).call({ from: account });
    const nftObj = { ...res, contractAddress }
    return structNftResponse(nftObj, network);
}

export const checkNFTBalance = async (network, id: number, address: string): Promise<any> => {
    const [account, nftContract, , contractAddress]: any[] = await getContract(network);
    const res = await nftContract.methods.balanceOf(address, id).call();
    return {
        network,
        contractAddress,
        address,
        balance: res,
    };
}

export const mintNFT = async (network: string, nftID: number, to: string, amount: number): Promise<any> => {
    const [account, nftContract, , , nonce]: any[] = await getContract(network);
    return await nftContract.methods.mint(to, nftID, amount).send({ from: account, nonce });
}

export const fetchNFTEditions = async (network, id: number): Promise<any> => {
    const [account, nftContract, , contractAddress]: any[] = await getContract(network);

    const nft = await nftContract.methods.getNft(id).call({ from: account });
    const holders = await fetchNFTHolders(network, id);

    const res = [];
    holders.map((holder) => {
        const newObj = { ...nft, owner: holder.address, balance: holder.balance, network, contractAddress };
        if (!res.find(h => h.owner == holder))
            res.push(structNftResponse(newObj, network));
    });

    return res;
}