import {FastifyReply, FastifyRequest} from "fastify";
import {request as unitRequest} from "undici";
import {StatusCodes} from "http-status-codes";
import {AuthResponse} from "../entities/auth.response";

/**
 * Middleware to authenticate requests by validating the token.
 * @param request
 * @param reply
 */
export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
    if ((request.headers['x-api-key']) === process.env.X_API_KEY) {
        return;
    }

    try {
        const responseData = await unitRequest('http://auth.transendence.com:8081/api/auth/validate', {
            method: 'POST',
            headers: {
                'Authorization': request.headers.authorization as string,
            },
        });

        if (responseData.statusCode === StatusCodes.OK) {
            const authResponse: AuthResponse = await responseData.body.json() as AuthResponse;
            request.participant = {
                uuid: authResponse.data.uuid,
                username: authResponse.data.username
            }
            return;
        }

        return reply.status(StatusCodes.UNAUTHORIZED).send({message: "Invalid token"});
    } catch (error) {
        console.error("Error validating token:", error);
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({message: "An error occurred while validating the token"});
    }
}
