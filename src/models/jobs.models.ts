import { Schema, model } from 'mongoose';
import { JobSchema } from '../types';

const basicSchema = {
	type: String,
	required: true,
	unique: true,
};

const jobsSchema = new Schema<JobSchema>(
	{
		title: { ...basicSchema, unique: false },
		link: basicSchema,
		users: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
	},
	{ timestamps: true },
);

const Jobs = model('Jobs', jobsSchema);

export default Jobs;
