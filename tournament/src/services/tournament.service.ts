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
import {
    isAllMatchesCompleted,
    validateRoundState,
    validateTournamentState,
    validateWinners
} from "../factories/tournament.validator";
import {setTimeoutFunc} from "../factories/tournament.settimeout";
import {isAlphanumeric} from "validator";
import {getEpochTime} from "../util/get_time";
import {TournamentResponseMessages} from "../constants/tournament.response.messages";

async function createTournamentService(tournamentDto: TournamentDto, participant: Participant) {
    if (!tournamentDto) {
        return new Result(StatusCodes.BAD_REQUEST, null, TournamentResponseMessages.ERR_TOURNAMENT_NAME_REQUIRED);
    }

    if (!tournamentDto.name || tournamentDto.name.trim() === '') {
        return new Result(StatusCodes.BAD_REQUEST, null, TournamentResponseMessages.ERR_TOURNAMENT_NAME_EMPTY);
    }

    if (!isAlphanumeric(tournamentDto.name)) {
        return new Result(StatusCodes.BAD_REQUEST, null, TournamentResponseMessages.ERR_TOURNAMENT_NAME_INVALID_CHARS);
    }

    const nameExists = Array.from(tournamentCache.values()).some(
        (tournament) => tournament.name === tournamentDto.name
    );

    if (nameExists) {
        return new Result(StatusCodes.CONFLICT, null, TournamentResponseMessages.ERR_TOURNAMENT_NAME_EXISTS);
    }

    const tournaments: TournamentData[] = Array.from(tournamentCache.values());
    for (const currTmt of tournaments) {
        if (currTmt.lobby_members.some(p => p.uuid === participant.uuid)) {
            return new Result(StatusCodes.CONFLICT, null, TournamentResponseMessages.ERR_PARTICIPANT_ALREADY_IN_TOURNAMENT);
        }
    }

    if (tournamentDto.name.length > 20) {
        return new Result(StatusCodes.BAD_REQUEST, null, TournamentResponseMessages.ERR_TOURNAMENT_NAME_TOO_LONG);
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

    return new Result(StatusCodes.CREATED, tournamentData, TournamentResponseMessages.SUCCESS_TOURNAMENT_CREATED);
}

async function joinTournamentService(code: string, participant: Participant) {
    const result = await tournamentControls(code);
    if (result.statusCode !== StatusCodes.OK || !result.data) {
        return result;
    }

    const tournament = result.data;

    if (tournament.participants.length > 10) {
        return new Result(StatusCodes.BAD_REQUEST, null, TournamentResponseMessages.ERR_MAX_10_PARTICIPANTS);
    }

    if (tournament.status !== TournamentStatus.CREATED) {
        return new Result(StatusCodes.BAD_REQUEST, null, TournamentResponseMessages.ERR_TOURNAMENT_NOT_JOINABLE);
    }

    const tournaments: TournamentData[] = Array.from(tournamentCache.values());
    for (const currTmt of tournaments) {
        if (currTmt.lobby_members.some(p => p.uuid === participant.uuid)) {
            return new Result(StatusCodes.CONFLICT, null, TournamentResponseMessages.ERR_PARTICIPANT_ALREADY_JOINED);
        }
    }

    tournament.lobby_members.push(participant);
    tournament.participants.push(participant);
    tournamentCache.set(code, tournament);

    return new Result(StatusCodes.OK, null, TournamentResponseMessages.SUCCESS_PARTICIPANT_JOINED);
}

async function tournamentControls(code: string) {
    if (!tournamentCache.has(code)) {
        return new Result(StatusCodes.NOT_FOUND, null, TournamentResponseMessages.ERR_TOURNAMENT_NOT_FOUND);
    }

    return new Result(StatusCodes.OK, tournamentCache.get(code), '');
}

async function leaveTournamentService(code: string, participant: Participant) {
    const result = await tournamentControls(code);
    if (result.statusCode !== StatusCodes.OK || !result.data) {
        return result;
    }

    const tournament = result.data;

    switch (tournament.status) {
        case TournamentStatus.CREATED:
            const participantIndex = tournament.participants.findIndex(p => p.uuid === participant.uuid);
            if (participantIndex === -1)
                return new Result(StatusCodes.NOT_FOUND, null, TournamentResponseMessages.ERR_PARTICIPANT_NOT_FOUND);

            if (tournament.admin_id === participant.uuid)
                return new Result(StatusCodes.FORBIDDEN, null, TournamentResponseMessages.ERR_ADMIN_CANNOT_LEAVE);

            tournament.lobby_members.splice(participantIndex, 1);
            tournament.participants.splice(participantIndex, 1);
            break;

        case TournamentStatus.ONGOING:
            const round = tournament.tournament_start!.rounds.find(r => !r.is_completed);
            if (!round)
                return new Result(StatusCodes.BAD_REQUEST, null, TournamentResponseMessages.ERR_NO_ONGOING_ROUNDS);

            for (const match of round.matches) {
                const isP1: boolean = match.participant1.uuid === participant.uuid;
                const isP2: boolean = match.participant2.uuid === participant.uuid;

                if (!isP1 && !isP2) continue;

                const loser = isP1 ? match.participant1 : match.participant2;
                tournament.lobby_members = tournament.lobby_members.filter(p => p.uuid !== loser.uuid);
                break;
            }
            break;

        case TournamentStatus.COMPLETED:
            const completedRound = tournament.tournament_start!.rounds.find(r => r.is_completed);
            if (!completedRound)
                return new Result(StatusCodes.BAD_REQUEST, null, TournamentResponseMessages.ERR_NO_COMPLETED_ROUNDS);
            const memberIndex = tournament.lobby_members.findIndex(p => p.uuid === participant.uuid);
            if (memberIndex === -1)
                return new Result(StatusCodes.NOT_FOUND, null, TournamentResponseMessages.ERR_PARTICIPANT_NOT_FOUND);
            tournament.lobby_members.splice(memberIndex, 1);
            break;
    }

    tournamentCache.set(code, tournament);
    return new Result(StatusCodes.OK, null, TournamentResponseMessages.SUCCESS_PARTICIPANT_LEFT);
}

async function deleteTournamentService(code: string, participant: Participant) {
    const result = await tournamentControls(code);
    if (result.statusCode !== StatusCodes.OK || !result.data) {
        return result;
    }

    const tournament = result.data;

    if (tournament.status !== TournamentStatus.CREATED) {
        return new Result(StatusCodes.BAD_REQUEST, null, TournamentResponseMessages.ERR_TOURNAMENT_NOT_DELETABLE);
    }

    if (tournament.admin_id !== participant.uuid) {
        return new Result(StatusCodes.FORBIDDEN, null, TournamentResponseMessages.ERR_ONLY_ADMIN_CAN_DELETE);
    }

    tournamentCache.delete(code);
    return new Result(StatusCodes.OK, null, TournamentResponseMessages.SUCCESS_TOURNAMENT_DELETED);
}

async function getTournamentParticipantsService(code: string) {
    const result = await tournamentControls(code);
    if (result.statusCode !== StatusCodes.OK || !result.data) {
        return new Result(result.statusCode, null, result.message);
    }

    const tournament = result.data;

    return new Result(StatusCodes.OK, tournament, TournamentResponseMessages.SUCCESS_PARTICIPANTS_RETRIEVED);
}

async function getTournamentByUUIDService(uuid: string) {
    const tournaments: TournamentData[] = Array.from(tournamentCache.values());
    const tournament = tournaments.find(t => t.lobby_members.some(l => l.uuid === uuid));

    if (!tournament) {
        return new Result(StatusCodes.NOT_FOUND, null, TournamentResponseMessages.ERR_TOURNAMENT_NOT_FOUND_UUID);
    }

    return new Result(StatusCodes.OK, tournament, TournamentResponseMessages.SUCCESS_TOURNAMENT_RETRIEVED_UUID);
}

async function startTournamentService(code: string, participant: Participant) {
    const result = await tournamentControls(code);
    if (result.statusCode !== StatusCodes.OK || !result.data) {
        return result;
    }

    const tournament = result.data;

    if (tournament.admin_id !== participant.uuid) {
        return new Result(StatusCodes.FORBIDDEN, null, TournamentResponseMessages.ERR_ONLY_ADMIN_CAN_START);
    }

    if (tournament.status !== TournamentStatus.CREATED) {
        return new Result(StatusCodes.BAD_REQUEST, null, TournamentResponseMessages.ERR_TOURNAMENT_NOT_STARTABLE);
    }

    if (tournament.participants.length < 2) {
        return new Result(StatusCodes.BAD_REQUEST, null, TournamentResponseMessages.ERR_NOT_ENOUGH_PARTICIPANTS);
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
    tournament.start_time = getEpochTime(0);
    tournament.tournament_start = tournamentStart;
    tournamentCache.set(code, tournament);

    await setTimeoutFunc(code, 1);
    return new Result(StatusCodes.OK, null, TournamentResponseMessages.SUCCESS_TOURNAMENT_STARTED);
}

async function addWinnerService(code: string, body: Winner) {
    const tournament = tournamentCache.get(code);
    if (!tournament) {
        return new Result(StatusCodes.NOT_FOUND, null, TournamentResponseMessages.ERR_TOURNAMENT_NOT_FOUND);
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

        for (const match of round.matches) {
            const isP1 = match.participant1.uuid === participant.uuid;
            const isP2 = match.participant2.uuid === participant.uuid;

            if (!isP1 && !isP2) continue;

            if (match.status !== MatchStatus.WAITING_PLAYER && match.status !== MatchStatus.ONGOING) {
                return new Result(StatusCodes.BAD_REQUEST, null, TournamentResponseMessages.ERR_MATCH_NOT_JOINABLE);
            }

            const loser = isP1 ? match.participant2 : match.participant1;
            const winner = isP1 ? match.participant1 : match.participant2;

            if (winner.status === ParticipantStatus.DISCONNECTED) {
                return new Result(StatusCodes.BAD_REQUEST, null, TournamentResponseMessages.ERR_PARTICIPANT_DISCONNECTED);
            }

            tournament.participants = tournament.participants.filter(p => p.uuid !== loser.uuid);
            match.status = MatchStatus.COMPLETED;
        }
        existingWinners.push(participant);
    }
    round.winners = existingWinners;

    if (existingWinners.length < round.expected_winner_count) {
        round.is_completed = false;
        tournament.tournament_start!.rounds = tournament.tournament_start!.rounds.map(r => r.round_number === round.round_number ? round : r);
        tournamentCache.set(code, tournament);
        return new Result(StatusCodes.OK, null, TournamentResponseMessages.SUCCESS_WINNER_ADDED);
    }

    round.is_completed = true;

    if (round.expected_winner_count <= 1 && existingWinners.length <= 1 && await isAllMatchesCompleted(round.matches)) {
        tournament.status = TournamentStatus.COMPLETED;
        tournament.end_time = getEpochTime(0);
        tournament.participants = tournament.participants.filter(p => !existingWinners.some(w => w.uuid === p.uuid));
        tournamentCache.set(code, tournament);
        const winner = round.winners[0] ? round.winners.at(0) : null;
        setTimeout(() => {
            // delete tournament from the cache after 5 hours
            tournamentCache.delete(code);
        }, 5 * 60 * 60 * 1000);
        return new Result(StatusCodes.OK, winner, TournamentResponseMessages.SUCCESS_TOURNAMENT_COMPLETED);
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
    return new Result(StatusCodes.OK, null, TournamentResponseMessages.SUCCESS_NEXT_ROUND_STARTED);
}

async function joinMatchService(code: string, body: MatchParticipant) {
    const tournament = tournamentCache.get(code);
    if (!tournament) {
        return new Result(StatusCodes.NOT_FOUND, null, TournamentResponseMessages.ERR_TOURNAMENT_NOT_FOUND);
    }

    if (tournament.status !== TournamentStatus.ONGOING) {
        return new Result(StatusCodes.BAD_REQUEST, null, TournamentResponseMessages.ERR_TOURNAMENT_NOT_MATCH_JOINABLE);
    }

    const roundNumber = body.round_number;
    const round = tournament.tournament_start!.rounds.find(r => r.round_number === roundNumber);
    if (!round) {
        return new Result(StatusCodes.NOT_FOUND, null, TournamentResponseMessages.ERR_ROUND_NOT_FOUND);
    }

    if (round.is_completed) {
        return new Result(StatusCodes.BAD_REQUEST, null, TournamentResponseMessages.ERR_ROUND_COMPLETED);
    }

    for (const match of round.matches) {
        const isP1 = match.participant1.uuid === body.participant.uuid;
        const isP2 = match.participant2.uuid === body.participant.uuid;

        if (!isP1 && !isP2) continue;

        if (match.status === MatchStatus.ONGOING || match.status === MatchStatus.COMPLETED) {
            return new Result(StatusCodes.BAD_REQUEST, null, TournamentResponseMessages.ERR_MATCH_STATE_NOT_JOINABLE);
        }

        const participant = isP1 ? match.participant1 : match.participant2;

        if (!tournament.lobby_members.find(p => p.uuid === participant.uuid)) {
            return new Result(StatusCodes.BAD_REQUEST, null, TournamentResponseMessages.ERR_PARTICIPANT_NOT_IN_TOURNAMENT);
        }

        if (participant.status === ParticipantStatus.JOINED) {
            return new Result(StatusCodes.BAD_REQUEST, null, TournamentResponseMessages.ERR_PARTICIPANT_ALREADY_IN_MATCH);
        }

        participant.status = ParticipantStatus.JOINED;

        if (match.status === MatchStatus.CREATED) {
            match.status = MatchStatus.WAITING_PLAYER;
        } else if (match.status === MatchStatus.WAITING_PLAYER) {
            match.status = MatchStatus.ONGOING;
        }

        tournament.tournament_start!.rounds = tournament.tournament_start!.rounds.map(r => r.round_number === roundNumber ? round : r);
        tournamentCache.set(code, tournament);
        return new Result(StatusCodes.OK, null, TournamentResponseMessages.SUCCESS_PARTICIPANT_JOINED_MATCH);
    }

    return new Result(StatusCodes.NOT_FOUND, null, TournamentResponseMessages.ERR_PARTICIPANT_NOT_FOUND_ROUND);
}

async function leaveMatchService(code: string, body: MatchParticipant) {
    const result = await tournamentControls(code);
    if (result.statusCode !== StatusCodes.OK || !result.data) {
        return result;
    }

    const validateTournament = await validateTournamentState(result.data);
    if (validateTournament.statusCode !== StatusCodes.OK || !validateTournament.data) {
        return validateTournament;
    }

    const tournament = validateTournament.data as TournamentData;
    const validateRound = await validateRoundState(tournament, body.round_number);
    if (validateRound.statusCode !== StatusCodes.OK || !validateRound.data) {
        return validateRound;
    }

    const roundNumber = body.round_number;
    const round = validateRound.data as Round;
    for (const match of round.matches) {
        const isP1 = match.participant1.uuid === body.participant.uuid;
        const isP2 = match.participant2.uuid === body.participant.uuid;

        if (!isP1 && !isP2) continue;

        if (match.status === MatchStatus.COMPLETED)
            return new Result(StatusCodes.BAD_REQUEST, null, TournamentResponseMessages.ERR_MATCH_STATE_NOT_LEAVABLE);

        const participant = isP1 ? match.participant1 : match.participant2;

        if (!tournament.lobby_members.find(p => p.uuid === participant.uuid)) {
            return new Result(StatusCodes.BAD_REQUEST, null, TournamentResponseMessages.ERR_PARTICIPANT_NOT_IN_TOURNAMENT);
        }

        if (participant.status === ParticipantStatus.DISCONNECTED) {
            return new Result(StatusCodes.BAD_REQUEST, null, TournamentResponseMessages.ERR_PARTICIPANT_ALREADY_DISCONNECTED);
        }

        participant.status = ParticipantStatus.DISCONNECTED;

        switch (match.status) {
            case MatchStatus.ONGOING:
                match.status = MatchStatus.WAITING_PLAYER;
                break;

            case MatchStatus.WAITING_PLAYER:
                match.status = MatchStatus.CREATED;
                break;

            case MatchStatus.CREATED:
                match.status = MatchStatus.CREATED;
                break;
        }

        tournament.tournament_start!.rounds = tournament.tournament_start!.rounds.map(r => r.round_number === roundNumber ? round : r);
        tournamentCache.set(code, tournament);
        return new Result(StatusCodes.OK, null, TournamentResponseMessages.SUCCESS_PARTICIPANT_LEAVED_MATCH);
    }

    return new Result(StatusCodes.NOT_FOUND, null, TournamentResponseMessages.ERR_PARTICIPANT_NOT_FOUND_ROUND);
}

export const TournamentService = {
    createTournamentService,
    joinTournamentService,
    leaveTournamentService,
    deleteTournamentService,
    getTournamentParticipantsService,
    getTournamentByUUIDService,
    startTournamentService,
    addWinnerService,
    joinMatchService,
    leaveMatchService,
}