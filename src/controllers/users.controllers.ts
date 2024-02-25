import { NextFunction, Request, Response } from 'express';
import { Users } from '../models';
import { RequestWithUser } from '../types';
import { AppError } from '../utils/errors.utils';
import { createHash, createToken } from '../utils/security.utils';

export async function createUser(
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> {
	try {
		const { email, password, github, name } = req.body;
		const user = await Users.findOne({ email });
		if (user) throw new AppError(400, 'User already exists');
		const hashPassword = createHash(password);
		const newUser = await Users.create({
			name,
			email,
			password: hashPassword[1],
			salt: hashPassword[0],
			github,
		});
		const accessToken = createToken(
			{ id: newUser._id },
			process.env.ACCESS_TOKEN_SECRET as string,
			'10m',
		);
		const _refreshToken = createToken(
			{ id: newUser._id },
			process.env.REFRESH_TOKEN_SECRET as string,
			'7d',
		);
		res.json({ accessToken, refreshToken: _refreshToken });
	} catch (error: any) {
		if (error.code === 11000) {
			error.message = `User already exists with ${Object.keys(error.keyValue)[0]}`;
			error.statusCode = 400;
		}
		next(error);
	}
}

export async function getUsers(
	req: RequestWithUser,
	res: Response,
	next: NextFunction,
): Promise<void> {
	try {
		const users = await Users.find({}, '-password -salt');
		if (!users) throw new AppError(404, 'Error getting users data');
		res.json(users);
	} catch (error) {
		next(error);
	}
}

export async function getUser(
	req: RequestWithUser,
	res: Response,
	next: NextFunction,
): Promise<void> {
	try {
		const { id } = req.params;
		const user = await Users.findById(id, '-password -salt');
		if (!user) throw new AppError(404, 'User not found');
		res.json(user);
	} catch (error) {
		next(error);
	}
}

export async function getMe(
	req: RequestWithUser,
	res: Response,
	next: NextFunction,
): Promise<void> {
	try {
		const { id } = req.user!;
		const user = await Users.findById(id, '-password -salt');
		if (!user) throw new AppError(404, 'User not found');
		res.json(user);
	} catch (error) {
		next(error);
	}
}

export async function likeUser(
	req: RequestWithUser,
	res: Response,
	next: NextFunction,
): Promise<void> {
	try {
		const { id } = req.params;
		const user = await Users.findById(id);
		if (!user) throw new AppError(404, 'User not found');
		const points = user.points + 1;
		user.points = points;
		await user.save();
		res.json({ message: `User '${user.name}' liked` });
	} catch (error) {
		next(error);
	}
}

export async function getMostLiked(
	req: RequestWithUser,
	res: Response,
	next: NextFunction,
): Promise<void> {
	try {
		const users = await Users.find({}, '-password -salt').sort({ points: -1 });
		if (!users) throw new AppError(404, 'Error getting users data');
		res.json(users);
	} catch (error) {
		next(error);
	}
}