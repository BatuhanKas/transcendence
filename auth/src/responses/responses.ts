import Result from "../bean/result";
import {FastifyReply} from "fastify";

/**
 * Utility functions to handle responses in Fastify.
 * @param result
 * @param reply
 */
export const getResult = <T>(result: Result<T>, reply: FastifyReply) => {
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

export const getResultAndToken = async <T>(result: Result<T>, reply: FastifyReply) => {
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

export const getResultAndDecodedToken = async <T>(result: Result<T>, reply: FastifyReply) => {
    const { statusCode, data, message } = result;

    if (statusCode >= 400) {
        return reply.status(statusCode).send({
            status: "FAIL",
            error: message,
        });
    }

    return reply.status(statusCode).send({
        status: "OK",
        message,
        data: data
    });
}