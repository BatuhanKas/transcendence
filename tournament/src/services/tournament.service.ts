// import { getTournamentByIdRepository } from '../services/tournament.repository';
import tournamentCache from '../cache/tournament.cache';
import { StatusCodes } from 'http-status-codes';
import { TournamentDto } from "../dto/tournament.dto";
import {getNextRoomId, getRoomCode, getRoundNumber} from "../util/id.counter";
import Result from '../bean/result';
import {Participant} from "../entities/participant";
import {Match, TournamentData, TournamentStart} from "../entities/tournament";
import {shuffleArray} from "../util/shuffle";
import {match} from "node:assert";

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
        status: 'created',
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

    if (tournament.status !== 'created') {
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

    if (tournament.status !== 'created') {
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

    return new Result(StatusCodes.OK, tournament.participants, `Participants for tournament ${code} retrieved successfully`);
}

export async function startTournamentService(code: string, body: { participants: Participant[] | null }) {
    const result = await tournamentControls(code);
    if (result.statusCode !== StatusCodes.OK || !result.data) {
        return result;
    }

    const tournament = result.data;

    if (tournament.status !== 'created') {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Tournament is not in a state to be started');
    }

    if (tournament.participants.length < 2) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Not enough participants to start the tournament');
    }

    tournament.status = 'ongoing';
    tournamentCache.set(code, tournament);

    const winners = [];
    const participants = body.participants === null ? tournament.participants : body.participants;
    // if (participants.length < 2) {
    //     tournament.status = 'completed';
    //     return new Result(StatusCodes.OK, participants[0], `Tournament ${code} winner is ${participants[0].username}`);
    // }

    const shuffledParticipants = await shuffleArray(participants);

    if (shuffledParticipants.length % 2 !== 0) {
        winners.push(shuffledParticipants[0]);
        shuffledParticipants.splice(0, 1);
    }

    const matches: Match[] = [];
    for (let i = 0; i < shuffledParticipants.length; i += 2) {
        matches.push(
            {
                participant1: shuffledParticipants[i],
                participant2: shuffledParticipants[i + 1]
            }
        );
    }

    const tournamentStart: TournamentStart = {
        id: tournament.id,
        name: tournament.name,
        admin_id: tournament.admin_id,
        status: tournament.status,
        code: tournament.code,
        participants: tournament.participants,
        rounds: [
            {
                round_number: getRoundNumber(),
                matches: matches,
                winner: winners.length > 0 ? winners : null
            }
        ]
    }

    return new Result(StatusCodes.OK, tournamentStart, `Tournament ${code} started successfully`);

}