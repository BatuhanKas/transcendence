import { FastifyRequest, FastifyReply } from 'fastify';
import { createTournamentService } from '../services/tournament.service';
import {TournamentDto} from "../dto/tournament.dto";

export async function createTournament(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as TournamentDto;

    const result = await createTournamentService(body);
    if (result.statusCode >= 400)
        return reply.status(result.statusCode).send({
            statusCode: result.statusCode,
            error: result.message
    });

    return reply.status(result.statusCode).send({
        statusCode: result.statusCode,
        data: result.data,
        message: result.message,
    });
}
