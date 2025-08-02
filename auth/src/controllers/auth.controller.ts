import {FastifyReply, FastifyRequest} from 'fastify';
import {User} from "../entities/user";
import {getResult, getResultAndDecodedToken, getResultAndToken} from "../responses/responses";
import * as AuthService from '../services/auth.service';

export async function login(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as User;

    const result = await AuthService.loginService(email, password);
    return await getResultAndToken(result, reply);
}

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const { username, email, password } = request.body as User;

    const result = await AuthService.registerService(username, email, password);
    return getResult(result, reply);
}

export async function validate(request: FastifyRequest, reply: FastifyReply) {
    const result = await AuthService.validateService(request);
    return getResultAndDecodedToken(result, reply);
}