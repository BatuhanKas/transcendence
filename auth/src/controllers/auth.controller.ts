import {FastifyReply, FastifyRequest} from 'fastify';
import {loginService, registerService, validateService} from "../services/auth.service";
import {User} from "../entities/user";
import Result from "../bean/result";

const getResult = <T>(result: Result<T>, reply: FastifyReply) => {
    const { statusCode, message } = result;

    if (statusCode >= 400) {
        return reply.status(statusCode).send({
            status: "FAIL",
            error: message,
        });
    }

    return reply.status(statusCode).send({
        status: "OK",
        message,
    });
};

const getResultAndToken = async <T>(result: Result<T>, reply: FastifyReply) => {
    const { statusCode, data, message } = result;

    if (statusCode >= 400) {
        return reply.status(statusCode).send({
            status: "FAIL",
            error: message,
        });
    }

    const userData = data as { uuid: string; username: string, email: string };
    const token = await reply.jwtSign({
        uuid: userData.uuid,
        username: userData.username,
        email: userData.email
    });

    return reply.status(statusCode).send({
        status: "OK",
        message,
        token: token
    });
}

export async function login(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as User;

    const result = await loginService(email, password);
    return await getResultAndToken(result, reply);
}

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const { username, email, password } = request.body as User;

    const result = await registerService(username, email, password);
    return getResult(result, reply);
}

export async function validate(request: FastifyRequest, reply: FastifyReply) {
    const result = await validateService(request);
    return getResult(result, reply);
}