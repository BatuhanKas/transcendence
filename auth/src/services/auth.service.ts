import Result from '../bean/result';
import randomUUID from 'crypto';
import bcrypt from 'bcryptjs';
import {StatusCodes} from "http-status-codes";
import {getUserByEmail, saveUser} from "../repositories/auth.repository";
import validator from 'validator';

export async function registerService(username: string, email: string, password: string) {
    if (!username || !email || !password) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Username, email, and password are required');
    }

    if (username.length < 3 || username.length > 20) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Username must be between 3 and 20 characters long');
    }

    if (!validator.isEmail(email)) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Invalid email format');
    }

    if (password.length < 6 || password.length > 25) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Password must be at least 6 characters long');
    }

    if (await getUserByEmail(email)) {
        return new Result(StatusCodes.CONFLICT, null, 'Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
        uuid: randomUUID.randomUUID(),
        username,
        email,
        password: hashedPassword,
    };

    await saveUser(user);

    return new Result(StatusCodes.CREATED, user, 'User registered successfully');
}