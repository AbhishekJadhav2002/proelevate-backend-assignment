import { NextFunction, Request, Response } from 'express';
import { Users } from '../models';
import { AppError } from '../utils/errors.utils';
import { comparePassword, createToken, verifyToken } from '../utils/security.utils';

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { email, password } = req.body;
        const user = await Users.findOne({ email });
        if (!user) throw new AppError(404, 'User not found');
        const passwordMatch = comparePassword(user.password, user.salt, password);
        if (passwordMatch) {
            const accessToken = createToken({ id: user._id }, process.env.ACCESS_TOKEN_SECRET as string, '10m');
            const _refreshToken = createToken({ id: user._id }, process.env.REFRESH_TOKEN_SECRET as string, '7d');
            res.json({ accessToken, refreshToken: _refreshToken });
        } else throw new AppError(401, 'Invalid credentials');
    } catch (error) {
        next(error);
    }
}

export async function refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { refreshToken: token } = req.body;
        const { id } = verifyToken<{ id: string; }>(token, process.env.REFRESH_TOKEN_SECRET as string, '7d');
        const accessToken = createToken({ id }, process.env.ACCESS_TOKEN_SECRET as string, '10m');
        res.json({ accessToken });
    } catch (error) {
        next(error);
    }
}
