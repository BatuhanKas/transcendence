import {FastifyReply, FastifyRequest} from 'fastify';
import {createTournamentService, joinTournamentService, leaveTournamentService} from '../services/tournament.service';
import {TournamentDto} from "../dto/tournament.dto";
import {ParticipantDto} from "../dto/participant.dto";
import Result from "../bean/result";

const getResult = <T>(result: Result<T>, reply: FastifyReply) => {
    const { statusCode, message } = result;

    if (statusCode >= 400) {
        return reply.status(statusCode).send({
            error: message,
        });
    }

    return reply.status(statusCode).send({
        message,
    });
};

export async function createTournament(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as TournamentDto;

    const result = await createTournamentService(body);
    return getResult(result, reply);
}

export async function joinTournament(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = request.body as ParticipantDto;

    const result = await joinTournamentService(id, body);
    return getResult(result, reply);
}

export async function leaveTournament(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = request.body as ParticipantDto;

    const result = await leaveTournamentService(id, body);
    return getResult(result, reply);
}