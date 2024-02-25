import { Document, SchemaTimestampsConfig } from 'mongoose';

export interface UserSchema extends Document, SchemaTimestampsConfig {
	email: string;
	name: string;
	password: string;
	salt: string;
	points: number;
	github: string;
}
