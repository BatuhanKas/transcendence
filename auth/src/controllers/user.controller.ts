import {FastifyReply, FastifyRequest} from 'fastify';
import {User} from "../entities/user";
import {getResult, getResultAndToken} from "../responses/responses";
import * as UserService from '../services/user.service';

export async function update(request: FastifyRequest<{ Body: User }>, reply: FastifyReply) {
    const user = request.body as User;

    const result = await UserService.updateUserService(user);
    if (!result.data)
        return getResult(result, reply);
    return getResultAndToken(result, reply);
}