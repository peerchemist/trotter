import config from 'src/config/config';
const IpfsHttpClient = require('ipfs-http-client');
const { pin, host, port, protocol } = config.ipfs;

const ipfs = IpfsHttpClient({ host, port, protocol });
export default ipfs;

export const ipfsAdd = async (buffer: Buffer): Promise<any> => {
    return ipfs.add(buffer, {
        pin,
    });
}
