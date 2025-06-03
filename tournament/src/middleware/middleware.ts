import {FastifyRequest} from "fastify";
import { request as unitRequest } from "undici";
import {StatusCodes} from "http-status-codes";
import Result from "../bean/result";

export async function authMiddleware(request: FastifyRequest) {
    try {
        const responseData = await unitRequest('http://localhost:8081/api/auth/validate', {
            method: 'POST',
            headers: {
                'Authorization': request.headers.authorization as string,
            },
        });

        if (responseData.statusCode === StatusCodes.OK) {
            const jsonData = await responseData.body.json();
            return new Result(StatusCodes.OK, jsonData, "Token is valid");
        }

        return new Result(StatusCodes.UNAUTHORIZED, null, "Invalid token");
    } catch (error) {
        return new Result(StatusCodes.INTERNAL_SERVER_ERROR, null, "Authentication service error");
    }
}
