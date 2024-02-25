import { Router } from 'express';
import { applyToJob, createJob, getJob, getJobs } from '../controllers';
import { auth } from '../middlewares';

const jobsRouter = Router();

jobsRouter
	.use(auth)
	.post('/', createJob)
	.get('/apply/:id', applyToJob)
	.get('/:id', getJob)
	.get('/', getJobs);

export default jobsRouter;
