import {FastifyReply, FastifyRequest} from "fastify";
import {request as unitRequest} from "undici";
import {StatusCodes} from "http-status-codes";
import {AuthResponse} from "../entities/auth.response";
import {TournamentResponseMessages} from "../constants/tournament.response.messages";

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
        const responseData = await unitRequest('https://auth.transendence.com/api/auth/validate', {
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

        return reply.status(StatusCodes.UNAUTHORIZED).send({message: TournamentResponseMessages.ERR_INVALID_TOKEN});
    } catch (error) {
        console.error("Error validating token:", error);
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({message: TournamentResponseMessages.ERR_INTERNAL_SERVER});
    }
}
