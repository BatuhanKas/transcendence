import {FastifyReply, FastifyRequest} from 'fastify';
import {User} from "../entities/user";
import {updateUserService} from "../services/user.service";
import {getResult, getResultAndToken} from "../responses/responses";

export async function updateUser(request: FastifyRequest<{ Body: User }>, reply: FastifyReply) {
    const user = request.body as User;

    const result = await updateUserService(user);
    if (!result.data)
        return getResult(result, reply);
    return getResultAndToken(result, reply);
}