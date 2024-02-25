import { Router } from 'express';
import { getMe, getUser, getUsers } from '../controllers';
import { auth } from '../middlewares';

const usersRouter = Router();

usersRouter
.use(auth)
    .get('/me', getMe)
    .get('/:id', getUser)
    .get('/', getUsers);

export default usersRouter;