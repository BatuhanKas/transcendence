import {FastifyReply, FastifyRequest} from 'fastify';
import {
    addWinnerService,
    createTournamentService,
    deleteTournamentService,
    getTournamentParticipantsService,
    joinTournamentService,
    leaveTournamentService, startTournamentService
} from '../services/tournament.service';
import {TournamentDto} from "../dto/tournament.dto";
import {Participant} from "../entities/participant";
import Result from "../bean/result";
import {authMiddleware} from "../middleware/middleware";
import {getResult, getResultAndData} from "../responses/responses";
import {AuthResponse} from "../entities/auth.response";
import {Winner} from "../entities/winner";

export async function createTournament(request: FastifyRequest, reply: FastifyReply) {
    const { statusCode, data, message } = await authMiddleware(request);
    if (statusCode != 200) {
        return getResult(new Result(statusCode, null, message), reply);
    }

    const body = request.body as TournamentDto;
    const authData = data as AuthResponse;
    const participant: Participant = {
        uuid: authData.data.uuid,
        username: authData.data.username
    }

    const result = await createTournamentService(body, participant);
    if (result.statusCode >= 400 || !result.data) {
        return getResult(result, reply);
    }
    return getResultAndData(result, reply);
}

export async function joinTournament(request: FastifyRequest, reply: FastifyReply) {
    const { statusCode, data, message } = await authMiddleware(request);
    if (statusCode != 200) {
        return getResult(new Result(statusCode, null, message), reply);
    }

    const { code } = request.params as { code: string };
    const authData = data as AuthResponse;
    const participant: Participant = {
        uuid: authData.data.uuid,
        username: authData.data.username
    }

    const result = await joinTournamentService(code, participant);
    return getResult(result, reply);
}

export async function leaveTournament(request: FastifyRequest, reply: FastifyReply) {
    const { statusCode, data, message } = await authMiddleware(request);
    if (statusCode != 200) {
        return getResult(new Result(statusCode, null, message), reply);
    }

    const { code } = request.params as { code: string };
    const authData = data as AuthResponse;
    const participant: Participant = {
        uuid: authData.data.uuid,
        username: authData.data.username
    }

    const result = await leaveTournamentService(code, participant);
    return getResult(result, reply);
}

export async function deleteTournament(request: FastifyRequest, reply: FastifyReply) {
    const { statusCode, data, message } = await authMiddleware(request);
    if (statusCode != 200) {
        return getResult(new Result(statusCode, null, message), reply);
    }

    const { code } = request.params as { code: string };
    const authData = data as AuthResponse;
    const participant: Participant = {
        uuid: authData.data.uuid,
        username: authData.data.username
    }

    const result = await deleteTournamentService(code, participant);
    return getResult(result, reply);
}

export async function getTournamentParticipants(request: FastifyRequest, reply: FastifyReply) {
    const { statusCode, message } = await authMiddleware(request);
    if (statusCode != 200) {
        return getResult(new Result(statusCode, null, message), reply);
    }

    const { code } = request.params as { code: string };
    const result = await getTournamentParticipantsService(code);
    if (result.statusCode !== 200 || !result.data) {
        return getResult(result, reply);
    }
    return getResultAndData(result, reply);
}

export async function startTournament(request: FastifyRequest, reply: FastifyReply) {
    const { statusCode, message } = await authMiddleware(request);
    if (statusCode != 200) {
        return getResult(new Result(statusCode, null, message), reply);
    }

    const { code } = request.params as { code: string };
    const result = await startTournamentService(code);
    return getResult(result, reply);
}

export async function addWinners(request: FastifyRequest, reply: FastifyReply) {
    const { statusCode, message } = await authMiddleware(request);
    if (statusCode != 200) {
        return getResult(new Result(statusCode, null, message), reply);
    }

    const { code } = request.params as { code: string };
    const body = request.body as Winner;

    const result = await addWinnerService(code, body);

}