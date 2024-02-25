import crypto from 'node:crypto';
import Jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { redisClient } from '../services';
import { AppError } from './errors.utils';

async function gracefulShutdown() {
    try {
        await redisClient.quit();
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

function createHash(text: string, _salt?: string) {
    try {
        const salt = _salt || crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(text, salt, 10, 16, 'sha512').toString('hex');
        return [salt, hash];
    } catch (error) {
        throw new AppError(500, 'Error while encrypting data');
    }
}

function comparePassword(hash: string, salt: string, text: string): boolean {
    try {
        const newHash = createHash(text, salt)[1];
        return newHash === hash;
    } catch (error) {
        throw new AppError(500, 'Error while verifying password');
    }
}

function createToken(data: string | object | Buffer, secret: string, expiry?: Jwt.SignOptions['expiresIn']): string {
    try {
        const token = Jwt.sign(
            data,
            secret,
            { algorithm: 'HS512', expiresIn: expiry },
        );
        return token;
    } catch (error) {
        throw new AppError(500, 'Error creating token');
    }
}

function verifyToken<T>(token: string, secret: string, expiry: Jwt.VerifyOptions['maxAge']): T | Jwt.JwtPayload {
    try {
        const decoded = Jwt.verify(
            token,
            secret,
            { algorithms: ['HS512'], maxAge: expiry },
        );
        return decoded as T | Jwt.JwtPayload;
    } catch (error) { throw new AppError(500, 'Session verification failed/expired'); }
}

export { comparePassword, createHash, createToken, gracefulShutdown, verifyToken };
