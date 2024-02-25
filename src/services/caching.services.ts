import { Jobs, Users } from '../models';
import { JobSchema, UserSchema } from '../types';
import { getAsync, setAsync } from './redis.services';

export async function getUserByEmail(email: string) {
	const cachedUser = await getAsync(`user:${email}`);
	if (cachedUser) {
		return JSON.parse(cachedUser) as UserSchema;
	}

	const user = await Users.findOne({ email });
	if (user) {
		await setAsync(`user:${email}`, JSON.stringify(user));
		return user;
	}
	return undefined;
}

export async function getUserById(id: string) {
	const cachedUser = await getAsync(`user:${id}`);
	if (cachedUser) {
		return JSON.parse(cachedUser) as UserSchema;
	}

	const user = await Users.findById(id);
	if (user) {
		await setAsync(`user:${id}`, JSON.stringify(user));
		return user;
	}
	return undefined;
}

export async function updateUserCache(user: UserSchema) {
	await setAsync(`user:${user._id}`, JSON.stringify(user));
	await setAsync(`user:${user.email}`, JSON.stringify(user));
}

export async function getJobById(id: string) {
	const cachedJob = await getAsync(`job:${id}`);
	if (cachedJob) {
		return JSON.parse(cachedJob) as JobSchema;
	}

	const job = await Jobs.findById(id).populate({
		path: 'users',
		select: 'name _id',
	});
	if (job) {
		await setAsync(`job:${id}`, JSON.stringify(job));
		return job;
	}
	return undefined;
}

export async function updateJobCache(job: JobSchema) {
	await setAsync(`job:${job._id}`, JSON.stringify(job));
}
