import {FastifyReply, FastifyRequest} from 'fastify';
import {TournamentDto} from "../dto/tournament.dto";
import {Participant} from "../entities/participant";
import Result from "../bean/result";
import {authMiddleware} from "../middleware/middleware";
import {getResult, getResultAndData} from "../responses/responses";
import {AuthResponse} from "../entities/auth.response";
import {MatchParticipant, Winner} from "../entities/winner";
import * as TournamentService from "../services/tournament.service";

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

    const result = await TournamentService.createTournamentService(body, participant);
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

    const result = await TournamentService.joinTournamentService(code, participant);
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

    const result = await TournamentService.leaveTournamentService(code, participant);
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

    const result = await TournamentService.deleteTournamentService(code, participant);
    return getResult(result, reply);
}

export async function getTournamentParticipants(request: FastifyRequest, reply: FastifyReply) {
    const { statusCode, message } = await authMiddleware(request);
    if (statusCode != 200) {
        return getResult(new Result(statusCode, null, message), reply);
    }

    const { code } = request.params as { code: string };
    const result = await TournamentService.getTournamentParticipantsService(code);
    if (result.statusCode !== 200 || !result.data) {
        return getResult(result, reply);
    }
    return getResultAndData(result, reply);
}

export async function getTournamentByUUID(request: FastifyRequest, reply: FastifyReply) {
    const { statusCode, data, message } = await authMiddleware(request);
    if (statusCode != 200) {
        return getResult(new Result(statusCode, null, message), reply);
    }

    const authData = data as AuthResponse;
    const participant: Participant = {
        uuid: authData.data.uuid,
        username: authData.data.username
    }

    const result = await TournamentService.getTournamentByUUIDService(participant.uuid);
    if (result.statusCode !== 200 || !result.data) {
        return getResult(result, reply);
    }
    return getResultAndData(result, reply);
}

export async function startTournament(request: FastifyRequest, reply: FastifyReply) {
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
    const result = await TournamentService.startTournamentService(code, participant);
    return getResult(result, reply);
}

export async function addWinners(request: FastifyRequest, reply: FastifyReply) {
    const { code } = request.params as { code: string };
    const body = request.body as Winner;

    const result = await TournamentService.addWinnerService(code, body);
    if (result.statusCode !== 200 || !result.data) {
        return getResult(result, reply);
    }
    return getResultAndData(result, reply);
}

export async function joinMatch(request: FastifyRequest, reply: FastifyReply) {
    const { code } = request.params as { code: string };
    const body = request.body as MatchParticipant;

    const result = await TournamentService.joinMatchService(code, body);
    return getResult(result, reply);
}