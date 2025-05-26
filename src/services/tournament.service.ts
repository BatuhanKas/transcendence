// import { getTournamentByIdRepository } from '../services/tournament.repository';
import tournamentCache from '../cache/tournament.cache';
import { StatusCodes } from 'http-status-codes';
import { TournamentDto } from "../dto/tournament.dto";
import {getNextRoomId} from "../util/id.counter";
import Result from '../bean/result';

export async function createTournamentService(tournamentDto: TournamentDto) {
    if (!tournamentDto) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Tournament ID is required');
    }

    // const tournamentNumber = parseInt(id, 10);
    // if (isNaN(tournamentNumber)) {
    //     return new Result(StatusCode.BAD_REQUEST, null, 'Tournament ID must be a number');
    // }

    // if (tournamentCache.has(tournamentNumber)) {
    //     return new Result(StatusCode.BAD_REQUEST, null, 'Tournament already exists');
    // }

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
