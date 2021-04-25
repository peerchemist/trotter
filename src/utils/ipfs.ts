import config from 'src/config/config';
const IpfsHttpClient = require('ipfs-http-client');
const { pin, host, port } = config.ipfs;

const ipfs = IpfsHttpClient({ host, port, protocol: 'https' });
export default ipfs;

export const ipfsAdd = async (buffer: Buffer): Promise<any> => {
    return ipfs.add(buffer, {
        pin,
    });
}
