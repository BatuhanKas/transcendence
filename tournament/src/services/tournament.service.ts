import tournamentCache from '../cache/tournament.cache';
import {StatusCodes} from 'http-status-codes';
import {TournamentDto} from "../dto/tournament.dto";
import {getNextRoomId, getRoomCode} from "../util/id.counter";
import Result from '../bean/result';
import {Participant, ParticipantStatus} from "../entities/participant";
import {MatchStatus, Round, TournamentData, TournamentStart, TournamentStatus} from "../entities/tournament";
import {shuffleArray} from "../util/shuffle";
import {MatchParticipant, Winner} from "../entities/winner";
import {createMatches, createRound} from "../factories/tournament.factory";
import {isAllMatchesCompleted, validateRoundState, validateTournamentState, validateWinners} from "../factories/tournament.validator";
import {setTimeoutFunc} from "../factories/tournament.settimeout";
import {isAlphanumeric} from "validator";
import {getDateAndHour, getHourAndAddMinutes} from "../util/get_time";

export async function createTournamentService(tournamentDto: TournamentDto, participant: Participant) {
    if (!tournamentDto) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Tournament name is required');
    }

    if (!tournamentDto.name || tournamentDto.name.trim() === '') {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Tournament name cannot be empty');
    }

    if (!isAlphanumeric(tournamentDto.name)) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Tournament name can only contain alphanumeric characters');
    }

    const nameExists = Array.from(tournamentCache.values()).some(
        (tournament) => tournament.name === tournamentDto.name
    );

    if (nameExists) {
        return new Result(StatusCodes.CONFLICT, null, 'Tournament name already exists');
    }

    const tournaments: TournamentData[] = Array.from(tournamentCache.values());
    for (const currTmt of tournaments) {
        if (currTmt.participants.some(p => p.uuid === participant.uuid)) {
            return new Result(StatusCodes.CONFLICT, null, 'Participant already joined a tournament');
        }
    }

    if (tournamentDto.name.length > 20) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Tournament name cannot be more than 20 characters');
    }

    const roomCode = getRoomCode();
    const roomId = getNextRoomId();

    const tournamentData: TournamentData = {
        id: roomId,
        code: roomCode,
        name: tournamentDto.name,
        admin_id: participant.uuid,
        lobby_members: [],
        participants: [],
        status: TournamentStatus.CREATED,
    }

    tournamentData.lobby_members.push(participant);
    tournamentData.participants.push(participant);
    tournamentCache.set(roomCode, tournamentData);

    return new Result(StatusCodes.CREATED, tournamentData, `Tournament with ID ${roomId} created successfully`);
}

export async function joinTournamentService(code: string, participant: Participant) {
    const result = await tournamentControls(code);
    if (result.statusCode !== StatusCodes.OK || !result.data) {
        return result;
    }

    const tournament = result.data;

    if (tournament.participants.length > 10) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Tournament cannot have more than 10 participants');
    }

    if (tournament.status !== TournamentStatus.CREATED) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Tournament is not in a state to join');
    }

    const tournaments: TournamentData[] = Array.from(tournamentCache.values());
    for (const currTmt of tournaments) {
        if (currTmt.participants.some(p => p.uuid === participant.uuid)) {
            return new Result(StatusCodes.CONFLICT, null, 'Participant already joined a tournament');
        }
    }

    tournament.lobby_members.push(participant);
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

    if (tournament.status !== TournamentStatus.CREATED) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Tournament is not in a state to leave');
    }

    if (tournament.admin_id === participant.uuid) {
        return new Result(StatusCodes.FORBIDDEN, null, 'Tournament admin cannot leave the tournament');
    }

    tournament.lobby_members.splice(participantIndex, 1);
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

    return new Result(StatusCodes.OK, tournament, `Participants for tournament ${code} retrieved successfully`);
}

export async function getTournamentByUUIDService(uuid: string) {
    const tournaments: TournamentData[] = Array.from(tournamentCache.values());
    const tournament = tournaments.find(t => t.participants.some(p => p.uuid === uuid));

    if (!tournament) {
        return new Result(StatusCodes.NOT_FOUND, null, 'Tournament not found for the given UUID');
    }

    return new Result(StatusCodes.OK, tournament, `Tournament for UUID ${uuid} retrieved successfully`);
}

export async function startTournamentService(code: string, participant: Participant) {
    const result = await tournamentControls(code);
    if (result.statusCode !== StatusCodes.OK || !result.data) {
        return result;
    }

    const tournament = result.data;

    if (tournament.admin_id !== participant.uuid) {
        return new Result(StatusCodes.FORBIDDEN, null, 'Only the tournament admin can start the tournament');
    }

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
    const firstRound = createRound(matches, winners, 1);
    rounds.push(firstRound);

    const tournamentStart: TournamentStart = {
        rounds: rounds
    }

    tournament.status = TournamentStatus.ONGOING;
    tournament.start_time = getDateAndHour();
    tournament.tournament_start = tournamentStart;
    tournamentCache.set(code, tournament);

    await setTimeoutFunc(code, 1);
    return new Result(StatusCodes.OK, null, `Tournament ${code} started successfully`);
}

export async function addWinnerService(code: string, body: Winner) {
    const tournament = tournamentCache.get(code);
    if (!tournament) {
        return new Result(StatusCodes.NOT_FOUND, null, 'Tournament not found');
    }

    const result = await validateTournamentState(tournament, null as any);
    if (result.statusCode !== StatusCodes.OK || !result.data) {
        return result;
    }

    const validTournament = result.data;

    const currentRound = await validateRoundState(validTournament, body.round_number);
    if (currentRound.statusCode !== StatusCodes.OK || !currentRound.data) {
        return currentRound;
    }

    const round = currentRound.data as Round;
    const existingWinners = round.winners || [];
    const participant = body.winner as Participant;

    /**
     * If the participant is null, it means the winner is not specified;
     * Code should be working for the case where the round is completed without a winner
     */
    if (participant) {
        const validationResult = await validateWinners(participant, round, existingWinners);
        if (validationResult.statusCode !== StatusCodes.OK) {
            return validationResult;
        }

        existingWinners.push(participant);
        for (const match of round.matches) {
            const isP1 = match.participant1.uuid === participant.uuid;
            const isP2 = match.participant2.uuid === participant.uuid;

            if (!isP1 && !isP2) continue;

            if (match.status !== MatchStatus.WAITING_PLAYER && match.status !== MatchStatus.ONGOING) {
                return new Result(StatusCodes.BAD_REQUEST, null, `Match for participant ${participant.username} is not in progress`);
            }

            const loser = isP1 ? match.participant2 : match.participant1;
            tournament.participants = tournament.participants.filter(p => p.uuid !== loser.uuid);

            match.status = MatchStatus.COMPLETED;
        }
    }
    round.winners = existingWinners;

    if (existingWinners.length < round.expected_winner_count) {
        round.is_completed = false;
        tournament.tournament_start!.rounds = tournament.tournament_start!.rounds.map(r => r.round_number === round.round_number ? round : r);
        tournamentCache.set(code, tournament);
        return new Result(StatusCodes.OK, null, 'Winner added successfully');
    }

    round.is_completed = true;

    if (round.expected_winner_count <= 1 && existingWinners.length <= 1 && await isAllMatchesCompleted(round.matches)) {
        tournament.status = TournamentStatus.COMPLETED;
        tournament.end_time = getDateAndHour();
        tournament.participants = tournament.participants.filter(p => !existingWinners.some(w => w.uuid === p.uuid));
        tournamentCache.set(code, tournament);
        const winner = round.winners[0] ? round.winners.at(0) : null;
        setTimeout(() => {
            // delete tournament from the cache after 5 hours
            tournamentCache.delete(code);
        },5 * 60 * 60 * 1000);
        return new Result(StatusCodes.OK, winner, 'Tournament completed successfully');
    }

    const shuffledParticipants = await shuffleArray(existingWinners);
    const winners: Participant[] = [];

    if (shuffledParticipants.length % 2 !== 0) {
        winners.push(shuffledParticipants[0]);
        shuffledParticipants.splice(0, 1);
    }

    const newMatches = createMatches(shuffledParticipants);
    const roundNumber = round.round_number + 1;
    const newRound = createRound(newMatches, winners, roundNumber);
    // Pushing the new round to the round array
    tournament.tournament_start!.rounds.push(newRound);
    // Updating the changed round on the round array
    tournament.tournament_start!.rounds = tournament.tournament_start!.rounds.map(r => r.round_number === round.round_number ? round : r);
    tournamentCache.set(code, tournament);
    await setTimeoutFunc(code, roundNumber);
    return new Result(StatusCodes.OK, null, 'Winner added and next round started successfully');
}

export async function joinMatchService(code: string, body: MatchParticipant) {
    console.log("joinMatchService");
    const tournament = tournamentCache.get(code);
    if (!tournament) {
        return new Result(StatusCodes.NOT_FOUND, null, 'Tournament not found');
    }

    if (tournament.status !== TournamentStatus.ONGOING) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Tournament is not in a state to join matches');
    }

    console.log("body", body);
    console.log("type of body", typeof body);
    console.log("round_number", body.round_number);
    const roundNumber = body.round_number;
    console.log("roundNumber", roundNumber);
    const round = tournament.tournament_start!.rounds.find(r => r.round_number === roundNumber);
    if (!round) {
        return new Result(StatusCodes.NOT_FOUND, null, `Round ${roundNumber} not found in tournament ${code}`);
    }

    if (round.is_completed) {
        return new Result(StatusCodes.BAD_REQUEST, null, `Round ${roundNumber} is already completed`);
    }

    for (const match of round.matches) {
        const isP1 = match.participant1.uuid === body.participant.uuid;
        const isP2 = match.participant2.uuid === body.participant.uuid;

        if (!isP1 && !isP2) continue;

        if (match.status === MatchStatus.ONGOING || match.status === MatchStatus.COMPLETED) {
            return new Result(StatusCodes.BAD_REQUEST, null, `Match for participant ${body.participant.username} is not in a state to join`);
        }

        const participant = isP1 ? match.participant1 : match.participant2;

        if (participant.status === ParticipantStatus.JOINED) {
            return new Result(StatusCodes.BAD_REQUEST, null, `Participant ${body.participant.username} is already joined in the match`);
        }

        participant.status = ParticipantStatus.JOINED;

        if (match.status === MatchStatus.CREATED) {
            match.status = MatchStatus.WAITING_PLAYER;
            match.expired_at = getHourAndAddMinutes(3);

            setTimeout(() => {
                if (match.status === MatchStatus.WAITING_PLAYER) {
                    const winner: Winner = {
                        round_number: roundNumber,
                        winner: {
                            'uuid': participant.uuid,
                            'username': participant.username
                        }
                    }
                    addWinnerService(code, winner);
                }
            },3 * 60 * 1000)

        } else if (match.status === MatchStatus.WAITING_PLAYER) {
            match.status = MatchStatus.ONGOING;
        }

        tournament.tournament_start!.rounds = tournament.tournament_start!.rounds.map(r => r.round_number === roundNumber ? round : r);
        tournamentCache.set(code, tournament);
        return new Result(StatusCodes.OK, null, `Participant ${body.participant.username} joined the match successfully`);
    }

    return new Result(StatusCodes.NOT_FOUND, null, `Participant ${body.participant.username} not found in any match of round ${roundNumber}`);
}
