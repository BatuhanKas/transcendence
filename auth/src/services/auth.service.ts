import Result from '../bean/result';
import randomUUID from 'crypto';
import bcrypt from 'bcryptjs';
import {StatusCodes} from "http-status-codes";
import {saveUser} from "../repositories/auth.repository";

export async function registerService(username: string, email: string, password: string) {
    if (!username || !email || !password) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Username, email, and password are required');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
        uuid: randomUUID.randomUUID(),
        username,
        email,
        password: hashedPassword,
    };

    // Save the user to the database (this is a placeholder, implement your own logic)
    await saveUser(user);

    return new Result(StatusCodes.CREATED, user, 'User registered successfully');
}