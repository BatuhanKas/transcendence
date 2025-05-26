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

    return new Result(StatusCodes.CREATED, tournamentCache.get(newRoomId), `Tournament with ID ${newRoomId} created successfully`,)
}

export async function joinTournamentService(id: string, body: ParticipantDto) {
    const tournamentNumber = Number(id);
    if (!Number.isInteger(tournamentNumber)) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Tournament ID must be a number');
    }

    if (!tournamentCache.has(tournamentNumber)) {
        return new Result(StatusCodes.NOT_FOUND, null, 'Tournament not found');
    }

    const tournament = tournamentCache.get(tournamentNumber);
    if (!tournament) {
        return new Result(StatusCodes.NOT_FOUND, null, 'Tournament not found');
    }

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