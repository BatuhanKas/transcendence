import tournamentCache from '../cache/tournament.cache';
import {StatusCodes} from 'http-status-codes';
import {TournamentDto} from "../dto/tournament.dto";
import {getNextRoomId, getRoomCode} from "../util/id.counter";
import Result from '../bean/result';
import {Participant} from "../entities/participant";
import {Round, TournamentData, TournamentStart, TournamentStatus} from "../entities/tournament";
import {shuffleArray} from "../util/shuffle";
import {Winner} from "../entities/winner";
import roundWinners from "../cache/winners.cache";
import {createMatches, createRound} from "../factories/tournament.factory";
import {validateRoundState, validateTournamentState} from "../factories/tournament.validator";

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

    const winners: Participant[] = [];
    const participants = tournament.participants;

    /**
     * which means if there is an odd number of participants,
     * shuffled first participant will be automatically added as a winner
     */
    const shuffledParticipants = await shuffleArray(participants);
    if (shuffledParticipants.length % 2 !== 0) {
        winners.push(shuffledParticipants[0]);
        shuffledParticipants.splice(0, 1);
    }

    const matches = createMatches(shuffledParticipants);

    const rounds: Round[] = [];
    const firstRound = createRound(matches, winners);
    rounds.push(firstRound);

    const tournamentStart: TournamentStart = {
        rounds: rounds
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

    const result = await validateTournamentState(tournament);
    if (result.statusCode !== StatusCodes.OK || !result.data) {
        return result;
    }

    const validTournament = result.data;

    const currentRound = await validateRoundState(validTournament, body.round_number);
    if (currentRound.statusCode !== StatusCodes.OK || !currentRound.data) {
        return currentRound;
    }

    const round = currentRound.data as Round;

    // Java stream().anyMatch() equivalent in JavaScript
    const isValidWinner = round.matches.some(match =>
        (match.participant1.uuid === body.winner.uuid) ||
        (match.participant2.uuid === body.winner.uuid)
    );

    if (!isValidWinner) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Winner is not part of the current matches');
    }

    const existingWinners = roundWinners.get(round.round_number) || [];

    if (existingWinners.length >= round.expected_winner_count) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Round is already completed');
    }

    if (existingWinners.some(winner => winner.uuid === body.winner.uuid)) {
        return new Result(StatusCodes.CONFLICT, null, 'Winner already added for this round');
    }

    const participant = body.winner as Participant;
    existingWinners.push(participant);
    roundWinners.set(round.round_number, existingWinners);

    if (existingWinners.length !== round.expected_winner_count) {
        round.is_completed = false;
        round.winner = null;
        tournament.tournament_start!.rounds = tournament.tournament_start!.rounds.map(r => r.round_number === round.round_number ? round : r);
        tournamentCache.set(code, tournament);
        return new Result(StatusCodes.OK, null, 'Winner added successfully');
    }

    round.is_completed = true;
    round.winner = existingWinners;

    if (round.expected_winner_count === 1) {
        tournament.status = TournamentStatus.COMPLETED;
        tournament.end_time = new Date();
        tournamentCache.set(code, tournament);
        return new Result(StatusCodes.OK, round.winner.at(0), 'Tournament completed successfully');
    }

    const shuffledParticipants = await shuffleArray(existingWinners);
    const winners: Participant[] = [];

    if (shuffledParticipants.length % 2 !== 0) {
        winners.push(shuffledParticipants[0]);
        shuffledParticipants.splice(0, 1);
    }

    const newMatches = createMatches(shuffledParticipants);
    const newRound = createRound(newMatches, winners);
    tournament.tournament_start!.rounds.push(newRound);

    tournament.tournament_start!.rounds = tournament.tournament_start!.rounds.map(r => r.round_number === round.round_number ? round : r);
    tournamentCache.set(code, tournament);
    return new Result(StatusCodes.OK, null, 'Winner added and next round started successfully');
}
