import { Router } from 'express';
import { createUser, login, refreshToken } from '../controllers';

const authRouter = Router();

authRouter
    .post('/signup', createUser)
    .post('/login', login)
    .post('/refresh', refreshToken);

export default authRouter;