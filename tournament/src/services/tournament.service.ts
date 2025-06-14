import tournamentCache from '../cache/tournament.cache';
import {StatusCodes} from 'http-status-codes';
import {TournamentDto} from "../dto/tournament.dto";
import {getNextRoomId, getRoomCode, getRoundNumber} from "../util/id.counter";
import Result from '../bean/result';
import {Participant} from "../entities/participant";
import {Match, TournamentData, TournamentStart, TournamentStatus} from "../entities/tournament";
import {shuffleArray} from "../util/shuffle";
import {Winner} from "../entities/winner";
import roundWinners from "../cache/winners.cache";

export async function createTournamentService(tournamentDto: TournamentDto, participant: Participant) {
    if (!tournamentDto) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Tournament name is required');
    }

    const nameExists = Array.from(tournamentCache.values()).some(
        (tournament) => tournament.name === tournamentDto.name
    );

    if (nameExists) {
        return new Result(StatusCodes.CONFLICT, null, 'Tournament name already exists');
    }

    const roomCode = getRoomCode();
    const roomId = getNextRoomId();

    const tournamentData: TournamentData = {
        id: roomId,
        code: roomCode,
        name: tournamentDto.name,
        admin_id: participant.uuid,
        participants: [],
        status: TournamentStatus.CREATED,
    }

    tournamentData.participants.push(participant);
    tournamentCache.set(roomCode, tournamentData);

    return new Result(StatusCodes.CREATED, tournamentData, `Tournament with ID ${roomId} created successfully`,)
}

export async function joinTournamentService(code: string, participant: Participant) {
    const result = await tournamentControls(code);
    if (result.statusCode !== StatusCodes.OK || !result.data) {
        return result;
    }

    const tournament = result.data;

    if (tournament.status !== TournamentStatus.CREATED) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Tournament is not in a state to join');
    }

    if (tournament.participants.some(p => p.uuid === participant.uuid)) {
        return new Result(StatusCodes.CONFLICT, null, 'Participant already joined the tournament');
    }

    tournament.participants.push(participant);
    tournamentCache.set(code, tournament);

    return new Result(StatusCodes.OK, null, `Participant ${participant.username} joined tournament ${code} successfully`);
}

export async function tournamentControls(code: string) {
    if (!tournamentCache.has(code)) {
        return new Result(StatusCodes.NOT_FOUND, null, 'Tournament not found');
    }

    return new Result(StatusCodes.OK, tournamentCache.get(code), '');
}

export async function leaveTournamentService(code: string, participant: Participant) {
    const result = await tournamentControls(code);
    if (result.statusCode !== StatusCodes.OK || !result.data) {
        return result;
    }

    const tournament = result.data;
    const participantIndex = tournament.participants.findIndex(p => p.uuid === participant.uuid);
    if (participantIndex === -1) {
        return new Result(StatusCodes.NOT_FOUND, null, 'Participant not found in the tournament');
    }

    if (tournament.admin_id === participant.uuid) {
        return new Result(StatusCodes.FORBIDDEN, null, 'Tournament admin cannot leave the tournament');
    }

    tournament.participants.splice(participantIndex, 1);
    tournamentCache.set(code, tournament);

    return new Result(StatusCodes.OK, null, `Participant ${participant.username} left tournament ${code} successfully`);
}

export async function deleteTournamentService(code: string, participant: Participant) {
    const result = await tournamentControls(code);
    if (result.statusCode !== StatusCodes.OK || !result.data) {
        return result;
    }

    const tournament = result.data;

    if (tournament.status !== TournamentStatus.CREATED) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Tournament is not in a state to be deleted');
    }

    if (tournament.admin_id !== participant.uuid) {
        return new Result(StatusCodes.FORBIDDEN, null, 'Only the tournament admin can delete the tournament');
    }

    tournamentCache.delete(code);
    return new Result(StatusCodes.OK, null, `Tournament with ID ${code} deleted successfully`);
}

export async function getTournamentParticipantsService(code: string) {
    const result = await tournamentControls(code);
    if (result.statusCode !== StatusCodes.OK || !result.data) {
        return new Result(result.statusCode, null, result.message);
    }

    const tournament = result.data;

    if (!tournament.participants || tournament.participants.length === 0) {
        return new Result(StatusCodes.NOT_FOUND, null, `No participants found for tournament ${code}`);
    }

    return new Result(StatusCodes.OK, tournament, `Participants for tournament ${code} retrieved successfully`);
}

export async function startTournamentService(code: string) {
    const result = await tournamentControls(code);
    if (result.statusCode !== StatusCodes.OK || !result.data) {
        return result;
    }

    const tournament = result.data;

    if (tournament.status !== TournamentStatus.CREATED) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Tournament is not in a state to be started');
    }

    if (tournament.participants.length < 2) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Not enough participants to start the tournament');
    }

    const winners = [];
    const participants = tournament.participants;

    const shuffledParticipants = await shuffleArray(participants);
    if (shuffledParticipants.length % 2 !== 0) {
        winners.push(shuffledParticipants[0]);
        shuffledParticipants.splice(0, 1);
    }

    const matches: Match[] = [];
    for (let i = 0; i < shuffledParticipants.length; i += 2) {
        const match: Match = {
            participant1: shuffledParticipants[i],
            participant2: shuffledParticipants[i + 1]
        }
        matches.push(match);
    }

    const tournamentStart: TournamentStart = {
        rounds: [
            {
                round_number: getRoundNumber(),
                matches: matches,
                winner: winners.length > 0 ? winners : null
            }
        ]
    }

    tournament.status = TournamentStatus.ONGOING;
    tournament.start_time = new Date();
    tournament.tournament_start = tournamentStart;
    tournamentCache.set(code, tournament);

    return new Result(StatusCodes.OK, null, `Tournament ${code} started successfully`);
}

export async function addWinnerService(code: string, body: Winner) {
    const tournament = tournamentCache.get(code);
    if (!tournament) {
        return new Result(StatusCodes.NOT_FOUND, null, 'Tournament not found');
    }

    if (tournament.status !== TournamentStatus.ONGOING) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Tournament is not in a state to add winners');
    }

    if (!tournament.tournament_start || !tournament.tournament_start.rounds) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'No rounds found in the tournament');
    }

    const round = tournament.tournament_start.rounds.find(r => r.round_number === body.round);
    if (!round) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Round not found');
    }

    const existingWinners = roundWinners.get(round.round_number) || [];
    const participant = body.winner as Participant;
    existingWinners.push(participant);
    roundWinners.set(round.round_number, existingWinners);
}
