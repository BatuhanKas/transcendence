import {FastifyReply, FastifyRequest} from 'fastify';
import {User} from "../entities/user";
import {getResult, getResultAndToken} from "../responses/responses";
import {UserService} from '../services/user.service';

async function update(request: FastifyRequest<{ Body: User }>, reply: FastifyReply) {
    const user = request.body as User;
    const params = request.params as { uuid: string };

    const result = await UserService.updateUserService(user, params.uuid);
    if (!result.data)
        return getResult(result, reply);
    return getResultAndToken(result, reply);
}

export const UserController = {
    update,
};