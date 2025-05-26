import { FastifyRequest, FastifyReply } from 'fastify';
import {createTournamentService, joinTournamentService} from '../services/tournament.service';
import {TournamentDto} from "../dto/tournament.dto";
import {ParticipantDto} from "../dto/participant.dto";

export async function createTournament(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as TournamentDto;

    const result = await createTournamentService(body);
    if (result.statusCode >= 400)
        return reply.status(result.statusCode).send({
            error: result.message
    });

    return reply.status(result.statusCode).send({
        message: result.message,
    });
}

export async function joinTournament(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = request.body as ParticipantDto;

    const result = await joinTournamentService(id, body);

    if (result.statusCode >= 400)
        return reply.status(result.statusCode).send({
            error: result.message
        });

    return reply.status(result.statusCode).send({
        message: result.message,
    });
}
