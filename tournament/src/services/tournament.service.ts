// import { getTournamentByIdRepository } from '../services/tournament.repository';
import tournamentCache from '../cache/tournament.cache';
import { StatusCodes } from 'http-status-codes';
import { TournamentDto } from "../dto/tournament.dto";
import {getNextRoomId, getNextUserId} from "../util/id.counter";
import Result from '../bean/result';
import {ParticipantDto} from "../dto/participant.dto";

export async function createTournamentService(tournamentDto: TournamentDto) {
    if (!tournamentDto) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Tournament ID is required');
    }

    const nameExists = Array.from(tournamentCache.values()).some(
        (tournament) => tournament.name === tournamentDto.name
    );

    if (nameExists) {
        return new Result(StatusCodes.CONFLICT, null, 'Tournament name already exists');
    }

    const newRoomId = getNextRoomId();
    tournamentCache.set(newRoomId, {
        id: newRoomId,
        name: tournamentDto.name,
        participants: [],
        status: 'created',
    });

    return new Result(StatusCodes.CREATED, null, `Tournament with ID ${newRoomId} created successfully`,)
}

export async function joinTournamentService(id: string, body: ParticipantDto) {
    const result = await tournamentControls(id);
    if (result.statusCode !== StatusCodes.OK || !result.data) {
        return result;
    }
    const tournamentNumber = Number(id);
    const tournament = result.data;

    if (tournament.status !== 'created') {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Tournament is not in a state to join');
    }

    tournament.participants.push({
        userId: getNextUserId(),
        username: body.name,
    });
    tournamentCache.set(tournamentNumber, tournament);

    return new Result(StatusCodes.OK, null, `Participant ${body.name} joined tournament ${tournamentNumber} successfully`);
}

export async function tournamentControls(id: string) {
    const tournamentNumber = Number(id);
    if (!Number.isInteger(tournamentNumber)) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Tournament ID must be a number');
    }

    if (!tournamentCache.has(tournamentNumber)) {
        return new Result(StatusCodes.NOT_FOUND, null, 'Tournament not found');
    }

    return new Result(StatusCodes.OK, tournamentCache.get(tournamentNumber), '');
}

export async function leaveTournamentService(id: string, body: ParticipantDto) {
    const result = await tournamentControls(id);
    if (result.statusCode !== StatusCodes.OK || !result.data) {
        return result;
    }

    const tournamentNumber = Number(id);
    const tournament = result.data;
    const participantIndex = tournament.participants.findIndex(p => p.username === body.name);
    if (participantIndex === -1) {
        return new Result(StatusCodes.NOT_FOUND, null, 'Participant not found in the tournament');
    }

    tournament.participants.splice(participantIndex, 1);
    tournamentCache.set(tournamentNumber, tournament);

    return new Result(StatusCodes.OK, null, `Participant ${body.name} left tournament ${tournamentNumber} successfully`);
}

export async function deleteTournamentService(id: string) {
    const result = await tournamentControls(id);
    if (result.statusCode !== StatusCodes.OK || !result.data) {
        return result;
    }

    const tournamentNumber = Number(id);
    const tournament = result.data;

    if (tournament.status !== 'created') {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Tournament is not in a state to be deleted');
    }

    tournamentCache.delete(tournamentNumber);
    return new Result(StatusCodes.OK, null, `Tournament with ID ${tournamentNumber} deleted successfully`);
}

export async function getTournamentParticipantsService(id: string) {
    const result = await tournamentControls(id);
    if (result.statusCode !== StatusCodes.OK || !result.data) {
        return new Result(result.statusCode, null, result.message);
    }

    const tournamentNumber = Number(id);
    const tournament = result.data;

    if (!tournament.participants || tournament.participants.length === 0) {
        return new Result(StatusCodes.NOT_FOUND, null, `No participants found for tournament ${tournamentNumber}`);
    }

    return new Result(StatusCodes.OK, tournament.participants, `Participants for tournament ${tournamentNumber} retrieved successfully`);
}