import Result from "../bean/result";
import {FastifyReply} from "fastify";

/**
 * Utility functions to handle responses in Fastify.
 * @param result
 * @param reply
 */
export const getResult = (result: Result<any>, reply: FastifyReply) => {
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

export const getResultAndData = async (result: Result<any>, reply: FastifyReply) => {
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