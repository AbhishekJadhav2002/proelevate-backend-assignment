import { NextFunction, Response } from 'express';
import { Jobs } from '../models';
import { getJobById, getUserById, updateJobCache } from '../services';
import { RequestWithUser } from '../types';
import { AppError } from '../utils/errors.utils';

export async function createJob(
	req: RequestWithUser,
	res: Response,
	next: NextFunction,
): Promise<void> {
	try {
		const { title, link } = req.body;
		const newJob = await Jobs.create({ title, link });
		if (!newJob) throw new AppError(400, 'Error creating job');
		await updateJobCache(newJob);
		res.send('Job created successfully');
	} catch (error) {
		next(error);
	}
}

export async function applyToJob(
	req: RequestWithUser,
	res: Response,
	next: NextFunction,
): Promise<void> {
	try {
		const { id } = req.params;
		const { id: myID } = req.user!;

		const job = await getJobById(id);
		if (!job) throw new AppError(404, 'Job not found');

		const userExists = await getUserById(myID);
		if (!userExists) throw new AppError(404, 'User not found');

		const jobUserIDs = job.users.map((user) => user._id);
		jobUserIDs.forEach((user) => {
			if (user === userExists._id)
				throw new AppError(400, 'User already applied');
		});

		jobUserIDs.push(userExists._id);
		const updatedJob = await Jobs.findByIdAndUpdate(
			id,
			{ users: jobUserIDs },
			{ new: true },
		).populate({
			path: 'users',
			select: 'name _id',
		});
		if (!updatedJob) throw new AppError(400, 'Error applying to job');

		await updateJobCache(updatedJob);
		res.send(`Applied to job ${job.title} successfully`);
	} catch (error) {
		next(error);
	}
}

export async function getJobs(
	req: RequestWithUser,
	res: Response,
	next: NextFunction,
): Promise<void> {
	try {
		const jobs = await Jobs.find().sort({ updatedAt: 'desc' }).populate({
			path: 'users',
			select: 'name _id',
		});
		res.json(jobs);
	} catch (error) {
		next(error);
	}
}

export async function getJob(
	req: RequestWithUser,
	res: Response,
	next: NextFunction,
): Promise<void> {
	try {
		const { id } = req.params;
		const job = await getJobById(id);
		if (!job) throw new AppError(404, 'Job not found');
		res.json(job);
	} catch (error) {
		next(error);
	}
}
