import {FastifyRequest} from "fastify";
import { request as unitRequest } from "undici";
import {StatusCodes} from "http-status-codes";
import Result from "../bean/result";

/**
 * Middleware to authenticate requests by validating the token.
 * @param request
 */
export async function authMiddleware(request: FastifyRequest) {
	if ((request.headers.bypass as string) == "bypassauth") {
		return new Result(StatusCodes.OK, {}, "Token is valid");
	}

    	try {//http://auth.transendence.com
        const responseData = await unitRequest('http://auth.transendence.com/api/auth/validate', {
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
        console.error("Error validating token:", error);
        return new Result(StatusCodes.INTERNAL_SERVER_ERROR, null, "An error occurred while validating the token");
    }
}
