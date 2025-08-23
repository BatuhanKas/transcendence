import {FastifyReply, FastifyRequest} from 'fastify';
import {User} from "../entities/user";
import {getResult, getResultAndDecodedToken, getResultAndToken} from "../responses/responses";
import {AuthService} from '../services/auth.service';
import {MailService} from "../services/mail.service";

async function login(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as User;

    const result = await AuthService.loginService(email, password);
    return await getResultAndToken(result, reply);
}

async function register(request: FastifyRequest, reply: FastifyReply) {
    const { username, email, password } = request.body as User;

    const result = await AuthService.registerService(username, email, password);
    return getResult(result, reply);
}

async function validate(request: FastifyRequest, reply: FastifyReply) {
    const result = await AuthService.validateService(request);
    return getResultAndDecodedToken(result, reply);
}

async function sendMail(request: FastifyRequest, reply: FastifyReply) {
    const { email } = request.body as { email: string };

    const result = await MailService.sendMail(email);
    return getResult(result, reply);
}

async function verify(request: FastifyRequest, reply: FastifyReply) {
    const params = request.body as { token: string, new_email?: string };

    const result = await AuthService.verifyService(params.token, params.new_email);
    return getResult(result, reply);
}

export const AuthController = {
    login,
    register,
    validate,
    sendMail,
    verify,
};