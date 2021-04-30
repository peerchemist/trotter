/***
 * Basic authentication to access server api's according to the BASIC authentication scheme https://tools.ietf.org/html/rfc7617
 * Never use this authentication mechanism on production without SSL/HTTPS
 * */

import { Request, Response, NextFunction } from 'express';
import config from '../config/config';
import tsscmp from 'tsscmp';

const WWW_AUTHENTICATE_HEADER = 'Basic realm="apKey"';

export function auth(req: Request, res: Response, next: NextFunction) {
    if (!config.isProductionEnvironment) {
        next();
        return;
    }
    // check for basic auth header
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Basic ')) {
        res.setHeader('WWW-Authenticate', WWW_AUTHENTICATE_HEADER);
        return res.status(401).json({ message: 'Access Denied!!' });
    }

    // verify auth credentials
    const base64Credentials = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    // check if api details is valid and prevent timing attacks
    if (
        !tsscmp(config.adminUsername, username) ||
        !tsscmp(config.adminPassword, password)
    ) {
        res.setHeader('WWW-Authenticate', WWW_AUTHENTICATE_HEADER);
        return res.status(401).json({ message: 'Invalid Authentication Credentials' });
    }

    next();
};
