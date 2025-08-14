import {FastifyReply, FastifyRequest} from 'fastify';
import {TournamentDto} from "../dto/tournament.dto";
import {Participant} from "../entities/participant";
import {getResult, getResultAndData} from "../responses/responses";
import {MatchParticipant, Winner} from "../entities/winner";
import {TournamentService} from "../services/tournament.service";

async function createTournament(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as TournamentDto;
    const participant = request.participant as Participant;

    const result = await TournamentService.createTournamentService(body, participant);
    if (result.statusCode >= 400 || !result.data) {
        return getResult(result, reply);
    }
    return getResultAndData(result, reply);
}

async function joinTournament(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { code: string };
    const participant = request.participant as Participant;

    const result = await TournamentService.joinTournamentService(params.code, participant);
    return getResult(result, reply);
}

async function leaveTournament(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { code: string };
    const participant = request.participant as Participant;

    const result = await TournamentService.leaveTournamentService(params.code, participant);
    return getResult(result, reply);
}

async function deleteTournament(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { code: string };
    const participant = request.participant as Participant;

    const result = await TournamentService.deleteTournamentService(params.code, participant);
    return getResult(result, reply);
}

async function getTournamentParticipants(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { code: string };

    const result = await TournamentService.getTournamentParticipantsService(params.code);
    if (result.statusCode !== 200 || !result.data) {
        return getResult(result, reply);
    }
    return getResultAndData(result, reply);
}

async function getTournamentByUUID(request: FastifyRequest, reply: FastifyReply) {
    const participant = request.participant as Participant;

    const result = await TournamentService.getTournamentByUUIDService(participant.uuid);
    if (result.statusCode !== 200 || !result.data) {
        return getResult(result, reply);
    }
    return getResultAndData(result, reply);
}

async function startTournament(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { code: string };
    const participant = request.participant as Participant;

    const result = await TournamentService.startTournamentService(params.code, participant);
    return getResult(result, reply);
}

async function addWinners(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { code: string };
    const body = request.body as Winner;

    const result = await TournamentService.addWinnerService(params.code, body);
    if (result.statusCode !== 200 || !result.data) {
        return getResult(result, reply);
    }
    return getResultAndData(result, reply);
}

async function joinMatch(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { code: string };
    const body = request.body as MatchParticipant;

    const result = await TournamentService.joinMatchService(params.code, body);
    return getResult(result, reply);
}

async function leaveMatch(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { code: string };
    const body = request.body as MatchParticipant;

    const result = await TournamentService.leaveMatchService(params.code, body);
    return getResult(result, reply);
}

export const TournamentController = {
    createTournament,
    joinTournament,
    leaveTournament,
    deleteTournament,
    getTournamentParticipants,
    getTournamentByUUID,
    startTournament,
    addWinners,
    joinMatch,
    leaveMatch,
};