import { Schema, model } from 'mongoose';
import { UserSchema } from '../types';

const basicSchema = {
    type: String,
    required: true,
    unique: true,
};

const usersSchema = new Schema<UserSchema>(
    {
        email: basicSchema,
        name: { ...basicSchema, unique: false },
        password: basicSchema,
        salt: basicSchema,
        points: { type: Number, required: false, default: 0 },
        github: basicSchema,
    },
    { timestamps: true },
);

const Users = model('Users', usersSchema);

export default Users;