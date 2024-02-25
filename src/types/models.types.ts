import { Document, SchemaTimestampsConfig, Types } from 'mongoose';

export interface UserSchema extends Document, SchemaTimestampsConfig {
	email: string;
	name: string;
	password: string;
	salt: string;
	points: number;
	github: string;
}

export interface JobSchema extends Document, SchemaTimestampsConfig {
	title: string;
	link: string;
	users: Types.ObjectId[];
}
