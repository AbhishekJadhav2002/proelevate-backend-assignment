import { Router } from 'express';
import {
	getMe,
	getMostLiked,
	getUser,
	getUsers,
	likeUser,
} from '../controllers';
import { auth } from '../middlewares';

const usersRouter = Router();

usersRouter
	.use(auth)
	.get('/me', getMe)
	.get('/most-liked', getMostLiked)
	.get('/:id', getUser)
	.get('/', getUsers)
	.get('/like/:id', likeUser);

export default usersRouter;
