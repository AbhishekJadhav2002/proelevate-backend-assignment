import { Router } from 'express';
import { errorHandler, healthCheck, notFound } from '../controllers';
import authRouter from './auth.routes';
import usersRouter from './users.routes';

const router = Router();

router.get('/health', healthCheck);

router.use('/auth', authRouter);
router.use('/users', usersRouter);

router.all('*', notFound);

router.use(errorHandler);

export default router;
