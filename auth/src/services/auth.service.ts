import Result from '../bean/result';
import randomUUID from 'crypto';
import bcrypt from 'bcryptjs';
import {StatusCodes} from "http-status-codes";
import {findUserByEmail, saveUser} from "../repositories/repository";
import validator from 'validator';
import {User} from "../entities/user";
import {FastifyInstance, FastifyRequest} from "fastify";

export async function validateService(request: FastifyRequest) {
    const authHeader = request.headers.authorization as string;
    const server = request.server as FastifyInstance;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Result(StatusCodes.UNAUTHORIZED, null, 'Authorization header is missing or invalid');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return new Result(StatusCodes.UNAUTHORIZED, null, 'Token is missing');
    }

    try {
        const decoded = server.jwt.verify(token);
        return new Result(StatusCodes.OK, decoded, 'Token is valid');
    } catch (err) {
        return new Result(StatusCodes.UNAUTHORIZED, null, 'Invalid token');
    }
}

export async function loginService(email: string, password: string) {
    if (!email || !password) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Email and password are required');
    }

    if (email.length < 5 || email.length > 50) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Email must be between 5 and 50 characters long');
    }

    if (!validator.isEmail(email)) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Invalid email format');
    }

    const user = await findUserByEmail(email) as User;
    if (!user || user.email !== email) {
        return new Result(StatusCodes.UNAUTHORIZED, null, 'Invalid email adress!');
    }

    if (password.length < 6 || password.length > 25) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Password must be at least 6 characters long');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return new Result(StatusCodes.UNAUTHORIZED, null, 'Invalid password!');
    }

    return new Result(StatusCodes.OK, { uuid: user.uuid, username: user.username, email: email }, 'Login successful');
}

export async function registerService(username: string, email: string, password: string) {
    if (!username || !email || !password) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Username, email, and password are required');
    }

    if (username.length < 3 || username.length > 20) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Username must be between 3 and 20 characters long');
    }

    if (email.length < 5 || email.length > 50) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Email must be between 5 and 50 characters long');
    }

    if (!validator.isEmail(email)) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Invalid email format');
    }

    if (password.length < 6 || password.length > 25) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Password must be at least 6 characters long');
    }

    if (await findUserByEmail(email)) {
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