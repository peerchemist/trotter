const IpfsHttpClient = require('ipfs-http-client');
const ipfs = IpfsHttpClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

export default ipfs;
