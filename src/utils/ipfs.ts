import config from 'src/config/config';
import * as pinataSDKMain from '@pinata/sdk';
const IpfsHttpClient = require('ipfs-http-client');

const { pin, host, port, protocol } = config.ipfs;
const { pinit, apikey, secretkey } = config.pinata;

const ipfs = IpfsHttpClient({ host, port, protocol });
export default ipfs;

export const ipfsAdd = async (buffer: Buffer): Promise<any> => {
    const res = await ipfs.add(buffer, {
        pin: pin == 'true' && true,
    });

    if (pinit == 'true') {
        const pinata: any = pinataSDKMain(apikey, secretkey);
        await pinata.pinByHash(res.path);
    }

    return res;
}
