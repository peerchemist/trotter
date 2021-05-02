"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ipfsAdd = void 0;
const config_1 = require("../config/config");
const IpfsHttpClient = require('ipfs-http-client');
const { pin, host, port, protocol } = config_1.default.ipfs;
const ipfs = IpfsHttpClient({ host, port, protocol });
exports.default = ipfs;
const ipfsAdd = async (buffer) => {
    return ipfs.add(buffer, {
        pin,
    });
};
exports.ipfsAdd = ipfsAdd;
//# sourceMappingURL=ipfs.js.map