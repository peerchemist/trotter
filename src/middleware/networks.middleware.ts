import { Request, Response, NextFunction } from 'express';
import config from 'src/config/config';

export function validateNetwork(req: Request, res: Response, next: NextFunction) {
    // check for network header
    const reqNetwork = req.headers.network;
    const network = reqNetwork?.toString();
    const defaultNetwork = config.networks.DEFAULT_NETWORK.replace('API_', '');;

    if (network && !(network in config.contracts))
        return res.status(400).json({ message: 'Invalid network' });
        
    const listed = config.listedNetworks[network];
    if (network && !listed)
        return res.status(400).json({ message: 'Network not supported yet' });
    
    // set default if we want optional network req
    if (!network)
        req.headers.network = defaultNetwork;
    
    next();
};