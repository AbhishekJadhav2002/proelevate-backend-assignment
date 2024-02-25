import { NextFunction, Response } from 'express';
import { Jobs, Users } from '../models';
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
		const job = await Jobs.findById(id);
		if (!job) throw new AppError(404, 'Job not found');
		const userExists = await Users.findById(myID);
		if (!userExists) throw new AppError(404, 'User not found');
		job.users.push(userExists._id);
		await job.save();
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
		const jobs = await Jobs.find({}, { updatedAt: -1 }).populate({
			path: 'users',
			select: '-password -salt',
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
		const job = await Jobs.findById(id).populate({
			path: 'users',
			select: '-password -salt',
		});
		if (!job) throw new AppError(404, 'Job not found');
		res.json(job);
	} catch (error) {
		next(error);
	}
}
