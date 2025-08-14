import Result from '../bean/result';
import randomUUID from 'crypto';
import bcrypt from 'bcryptjs';
import {StatusCodes} from "http-status-codes";
import validator, {isAlphanumeric} from 'validator';
import {User} from "../entities/user";
import {FastifyInstance, FastifyRequest} from "fastify";
import {AuthResponseMessages} from "../constants/auth.response.messages";
import {AuthRepository} from '../repositories/repository';
import {MailService} from "./mail.service";

async function validateService(request: FastifyRequest) {
    const authHeader = request.headers.authorization as string;
    const server = request.server as FastifyInstance;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Result(StatusCodes.UNAUTHORIZED, null, AuthResponseMessages.AUTH_HEADER_MISSING_OR_INVALID);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return new Result(StatusCodes.UNAUTHORIZED, null, AuthResponseMessages.TOKEN_MISSING);
    }

    try {
        // Verify the JWT token using the server's jwt plugin
        const decoded = server.jwt.verify(token);
        return new Result(StatusCodes.OK, decoded, AuthResponseMessages.TOKEN_VALID);
    } catch (err) {
        console.error('Token verification error:', err);
        return new Result(StatusCodes.UNAUTHORIZED, null, AuthResponseMessages.INVALID_TOKEN);
    }
}

async function loginService(email: string, password: string) {
    if (!email || !password) {
        return new Result(StatusCodes.BAD_REQUEST, null, AuthResponseMessages.EMAIL_AND_PASSWORD_REQUIRED);
    }

    if (email.length < 5 || email.length > 50) {
        return new Result(StatusCodes.BAD_REQUEST, null, AuthResponseMessages.EMAIL_LENGTH_INVALID);
    }

    if (!validator.isEmail(email)) {
        return new Result(StatusCodes.BAD_REQUEST, null, AuthResponseMessages.INVALID_EMAIL_FORMAT);
    }

    const user = await AuthRepository.findUserByEmail(email) as User;
    if (!user || user.email !== email) {
        return new Result(StatusCodes.UNAUTHORIZED, null, AuthResponseMessages.INVALID_EMAIL);
    }

    if (!user.verified) {
        return new Result(StatusCodes.UNAUTHORIZED, null, AuthResponseMessages.USER_NOT_VERIFIED);
    }

    if (password.length < 6 || password.length > 25) {
        return new Result(StatusCodes.BAD_REQUEST, null, AuthResponseMessages.PASSWORD_LENGTH_INVALID);
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return new Result(StatusCodes.UNAUTHORIZED, null, AuthResponseMessages.INVALID_PASSWORD);
    }

    return new Result(StatusCodes.OK, { uuid: user.uuid, username: user.username, email: email }, AuthResponseMessages.LOGIN_SUCCESS);
}

async function registerService(username: string, email: string, password: string) {
    if (!username || !email || !password) {
        return new Result(StatusCodes.BAD_REQUEST, null, AuthResponseMessages.REGISTRATION_FIELDS_REQUIRED);
    }

    if (!isAlphanumeric(username)) {
        return new Result(StatusCodes.BAD_REQUEST, null, AuthResponseMessages.USERNAME_NOT_ALPHANUMERIC);
    }

    if (username.length < 3 || username.length > 20) {
        return new Result(StatusCodes.BAD_REQUEST, null, AuthResponseMessages.USERNAME_LENGTH_INVALID);
    }

    if (email.length < 5 || email.length > 50) {
        return new Result(StatusCodes.BAD_REQUEST, null, AuthResponseMessages.EMAIL_LENGTH_INVALID);
    }

    if (!validator.isEmail(email)) {
        return new Result(StatusCodes.BAD_REQUEST, null, AuthResponseMessages.INVALID_EMAIL_FORMAT);
    }

    if (password.length < 6 || password.length > 25) {
        return new Result(StatusCodes.BAD_REQUEST, null, AuthResponseMessages.PASSWORD_LENGTH_INVALID);
    }

    if (await AuthRepository.findUserByUsername(username)) {
        return new Result(StatusCodes.CONFLICT, null, AuthResponseMessages.USERNAME_EXISTS);
    }

    if (await AuthRepository.findUserByEmail(email)) {
        return new Result(StatusCodes.CONFLICT, null, AuthResponseMessages.EMAIL_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
        uuid: randomUUID.randomUUID(),
        username,
        email,
        password: hashedPassword,
    };

    await AuthRepository.saveUser(user);

    return await MailService.sendMail(email);
}

async function verifyService(token: string) {
    if (!token) {
        return new Result(StatusCodes.BAD_REQUEST, null, "Missing token");
    }

    if (!MailService.emailCache.has(token)) {
        return new Result(StatusCodes.NOT_FOUND, null, "Invalid or expired token");
    }

    const email = MailService.emailCache.get(token);
    if (!email) {
        return new Result(StatusCodes.NOT_FOUND, null, "Invalid or expired token");
    }

    MailService.emailCache.delete(token);

    const user = await AuthRepository.findUserByEmail(email);
    if (!user) {
        return new Result(StatusCodes.NOT_FOUND, null, "User not found");
    }

    user.verified = true;
    await AuthRepository.updateUserRepository(user);

    return new Result(StatusCodes.OK, null, AuthResponseMessages.USER_REGISTERED);
}

export const AuthService = {
    validateService,
    loginService,
    registerService,
    verifyService
};