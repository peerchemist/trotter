"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const config_1 = require("../config/config");
const PRODUCTION_ENV = 'prod';
function auth(req, res, next) {
    if (config_1.default.nodeEnv.trim() !== PRODUCTION_ENV) {
        next();
        return;
    }
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).send({ message: 'Access Denied!!' });
    }
    const base64Credentials = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    if (config_1.default.adminUsername !== username || config_1.default.adminPassword !== password) {
        return res.status(401).json({ message: 'Invalid Authentication Credentials' });
    }
    next();
}
exports.auth = auth;
;
//# sourceMappingURL=auth.middleware.js.map