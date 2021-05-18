import config from 'src/config/config';
const IpfsHttpClient = require('ipfs-http-client');
// const pinataSDK = require('@pinata/sdk');

const { pin, host, port, protocol } = config.ipfs;
const { pinit, apikey, secretkey } = config.pinata;

const ipfs = IpfsHttpClient({ host, port, protocol });
export default ipfs;

export const ipfsAdd = async (buffer: Buffer): Promise<any> => {
    return await ipfs.add(buffer, {
        pin,
    });

    // // if (pinit) {
    // //     const pinata = pinataSDK(apikey, secretkey);
    // //     await pinata.pinByHash(res.path);
    // // }

    // return res;
}
