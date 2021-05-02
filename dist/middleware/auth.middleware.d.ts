import { Request, Response, NextFunction } from 'express';
export declare function auth(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>>;
