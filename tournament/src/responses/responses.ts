import Result from "../bean/result";
import {FastifyReply} from "fastify";

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

export const getResultAndData = async <T>(result: Result<T>, reply: FastifyReply) => {
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