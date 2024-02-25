import { Users } from '../models';
import { UserSchema } from '../types';
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
	return null;
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
	return null;
}
