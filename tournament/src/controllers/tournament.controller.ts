import {FastifyReply, FastifyRequest} from 'fastify';
import {
    createTournamentService,
    deleteTournamentService,
    getTournamentParticipantsService,
    joinTournamentService,
    leaveTournamentService
} from '../services/tournament.service';
import {TournamentDto} from "../dto/tournament.dto";
import {ParticipantDto} from "../dto/participant.dto";
import Result from "../bean/result";
import {authMiddleware} from "../middleware/middleware";

const getResult = <T>(result: Result<T>, reply: FastifyReply) => {
    const { statusCode, message } = result;

    if (statusCode >= 400) {
        return reply.status(statusCode).send({
            status: "FAIL",
            error: message,
        });
    }

    return reply.status(statusCode).send({
        status: "OK",
        message,
    });
};

const getResultAndData = async <T>(result: Result<T>, reply: FastifyReply) => {
    const { statusCode, data, message } = result;

    if (statusCode >= 400) {
        return reply.status(statusCode).send({
            status: "FAIL",
            error: message,
        });
    }

    return reply.status(statusCode).send({
        status: "OK",
        message,
        data: data
    });
}

export async function createTournament(request: FastifyRequest, reply: FastifyReply) {
    const { statusCode, message } = await authMiddleware(request, reply);
    if (statusCode != 200) {
        return getResult(new Result(statusCode, null, message), reply);
    }

    const body = request.body as TournamentDto;

    const result = await createTournamentService(body);
    return getResult(result, reply);
}

export async function joinTournament(request: FastifyRequest, reply: FastifyReply) {
    const { statusCode, message } = await authMiddleware(request, reply);
    if (statusCode != 200) {
        return getResult(new Result(statusCode, null, message), reply);
    }

    const { id } = request.params as { id: string };
    const body = request.body as ParticipantDto;

    const result = await joinTournamentService(id, body);
    return getResult(result, reply);
}

export async function leaveTournament(request: FastifyRequest, reply: FastifyReply) {
    const { statusCode, message } = await authMiddleware(request, reply);
    if (statusCode != 200) {
        return getResult(new Result(statusCode, null, message), reply);
    }

    const { id } = request.params as { id: string };
    const body = request.body as ParticipantDto;

    const result = await leaveTournamentService(id, body);
    return getResult(result, reply);
}

export async function deleteTournament(request: FastifyRequest, reply: FastifyReply) {
    const { statusCode, message } = await authMiddleware(request, reply);
    if (statusCode != 200) {
        return getResult(new Result(statusCode, null, message), reply);
    }

    const { id } = request.params as { id: string };

    const result = await deleteTournamentService(id);
    return getResult(result, reply);
}

export async function getTournamentParticipants(request: FastifyRequest, reply: FastifyReply) {
    const { statusCode, message } = await authMiddleware(request, reply);
    if (statusCode != 200) {
        return getResult(new Result(statusCode, null, message), reply);
    }

    const { id } = request.params as { id: string };
    const result = await getTournamentParticipantsService(id);
    if (result.statusCode !== 200 || !result.data) {
        return getResult(result, reply);
    }
    return getResultAndData(result, reply);
}