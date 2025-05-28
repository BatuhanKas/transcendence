import {FastifyReply, FastifyRequest} from 'fastify';
import {registerService} from "../services/auth.service";
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

export async function login(request: FastifyRequest, reply: FastifyReply) {
    // const { username, password } = request.body as { username: string; password: string };
    //
    // // Implement your authentication logic here
    // if (username === 'test' && password === 'password') {
    //     return reply.status(200).send({ message: 'Login successful' });
    // } else {
    //     return reply.status(401).send({ error: 'Invalid credentials' });
    // }
}

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const { username, email, password } = request.body as User;

    const result = await registerService(username, email, password);
    return getResult(result, reply);
}