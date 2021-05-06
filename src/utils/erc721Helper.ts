import Web3 from 'src/utils/web3';
import { Nft } from 'src/models/interfaces/nft.interface';
import { structNftResponse } from './response';
import config from '../config/config';
const fs = require('fs');

export const getContract = async (network: string): Promise<any[]> => {
    const defaultNetwork = config.networks.DEFAULT_NETWORK.replace('API_', '');
    const contracts = config.contracts;
    const usenetwork = network && contracts[network] && config.networks[network] ? network : defaultNetwork;
    console.log({ usenetwork });
    
    const web3 = Web3(usenetwork);
    const gasPrice = await web3.eth.getGasPrice();
    const gas = !network.includes('MATIC_MAINNET') && 1000000;
    const accounts: string[] = await web3.eth.getAccounts();
    // get transaction count for this wallet
    const nonce = await web3.eth.getTransactionCount(accounts[0])
    const contractAddress = contracts[usenetwork];

    const contractJson = fs.readFileSync('src/config/abi/trotterNftErc721.json');
    const abi = JSON.parse(contractJson);
    const nftContract: any = new web3.eth.Contract(abi, contractAddress);
    return [accounts[0], nftContract, usenetwork, contractAddress, nonce, gasPrice, gas];
}

export const getNetworkByPrefix = (tokenId: string) => {
    const split = tokenId.split('-');
    const network = config.networkPrefixes[split[0]];
    const tokenid = parseInt(split[1]) || parseInt(split[0]);
    return [tokenid, network?.toString()]
}

export const createErc721 = async (network, nft: Nft): Promise<any> => {
    const [account, nftContract, , , nonce, gasPrice, gas]: any[] = await getContract(network);
    const nftData = [nft.name, nft.ipfsHash, nft.price || 0, nft.author, nft.about, JSON.stringify(nft.properties || ''), JSON.stringify(nft.statement || '')];    
    return await nftContract.methods.createNft(...nftData, account).send({ from: account, gasPrice, gas, nonce });
}

export const transferErc721 = async (network: string, to: string, nftID: string): Promise<any> => {
    const [tokenid, networkByPrefix] = getNetworkByPrefix(nftID);
    const [account, nftContract, , , nonce]: any[] = await getContract(networkByPrefix || network);
    return await nftContract.methods.transferFrom(account, to, tokenid).send({ from: account, nonce });
}

export const fetchErc721s = async (usenetwork?: string): Promise<any> => {
    const [account, nftContract, network, contractAddress]: any[] = await getContract(usenetwork);
    const nftsCount = await nftContract.methods.currentTokenId().call({ from: account });

    const nfts = [];
    const owners = [];

    for (let i = 0; i < nftsCount - 90000000; i++) {
        nfts.push(nftContract.methods.nfts(i).call({ from: account }));
        owners.push(nftContract.methods.ownerOf(i + 90000000).call());
    }

    const resNfts = await Promise.all(nfts);
    const resOwners = await Promise.all(owners);

    return resNfts.map((nft, index) => {
        const newObj = { ...nft, contractAddress, owner: resOwners[index] };
        return structNftResponse(newObj, network);
    });
}

export const getErc721 = async (network: string, id: string): Promise<any> => {
    const [tokenid, networkByPrefix] = getNetworkByPrefix(id);
    const [account, nftContract, , contractAddress]: any[] = await getContract(networkByPrefix || network);
    const res = await nftContract.methods.nfts(tokenid - 90000000).call();
    const owner = await nftContract.methods.ownerOf(tokenid).call();
    const nftObj = { ...res, contractAddress, owner };
    return structNftResponse(nftObj, network);
}

export const checkErc721Balance = async (network: string, address: string): Promise<any> => {
    const [account, nftContract, , contractAddress]: any[] = await getContract(network);
    const res = await nftContract.methods.balanceOf(address).call();
    return {
        network,
        contractAddress,
        address,
        balance: res,
    };
}
