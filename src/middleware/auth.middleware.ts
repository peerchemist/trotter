import { Request, Response, NextFunction } from 'express';
import config from '../config/config';

const PRODUCTION_ENV = 'prod';

export function auth(req: Request, res: Response, next: NextFunction) {

    if (config.nodeEnv.trim() !== PRODUCTION_ENV) {
        next();
        return
    }

    // check for basic auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).send({ message: 'Access Denied!!' });
    }

    // verify auth credentials
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    // check if api details is valid
    if (config.adminUsername !== username || config.adminPassword !== password) {
        return res.status(401).json({ message: 'Invalid Authentication Credentials' });
    }
    
    next();
};