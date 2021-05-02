"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNetwork = void 0;
const config_1 = require("../config/config");
function validateNetwork(req, res, next) {
    const reqNetwork = req.headers.network;
    const network = reqNetwork === null || reqNetwork === void 0 ? void 0 : reqNetwork.toString();
    const defaultNetwork = config_1.default.networks.DEFAULT_NETWORK.replace('API_', '');
    ;
    if (network && !(network in config_1.default.contracts))
        return res.status(400).json({ message: 'Invalid network' });
    const listed = config_1.default.listedNetworks[network];
    if (network && !listed)
        return res.status(400).json({ message: 'Network not supported yet' });
    if (!network)
        req.headers.network = defaultNetwork;
    next();
}
exports.validateNetwork = validateNetwork;
;
//# sourceMappingURL=networks.middleware.js.map