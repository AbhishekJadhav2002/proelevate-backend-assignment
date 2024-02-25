import { NextFunction, Response } from 'express';
import { RequestWithUser } from '../types';
import { AppError } from '../utils/errors.utils';
import { verifyToken } from '../utils/security.utils';

async function auth(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        next(new AppError(401, 'Auth token not found'));
        return;
    }

    try {
        const decoded = verifyToken<{ id: string; }>(token, process.env.ACCESS_TOKEN_SECRET as string, '10m');
        req.user = { id: decoded.id };
        next();
    } catch (err) {
        next(new AppError(401, 'Invalid token'));
    }
}

export default auth;