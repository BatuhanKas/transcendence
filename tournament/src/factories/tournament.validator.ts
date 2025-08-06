import {Match, MatchStatus, Round, TournamentData, TournamentStatus} from "../entities/tournament";
import Result from "../bean/result";
import {StatusCodes} from "http-status-codes";
import {Participant} from "../entities/participant";
import {TournamentResponseMessages} from "../constants/tournament.response.messages";

/**
 * Validate states of the tournament before adding winners.
 * @param tournament
 */
export async function validateTournamentState(tournament: TournamentData) {
    if (tournament.status !== TournamentStatus.ONGOING) {
        return new Result(StatusCodes.BAD_REQUEST, null, TournamentResponseMessages.ERR_TOURNAMENT_NOT_ADD_WINNERS);
    }

    if (!tournament.tournament_start || !tournament.tournament_start.rounds) {
        return new Result(StatusCodes.BAD_REQUEST, null, TournamentResponseMessages.ERR_NO_ROUNDS_FOUND);
    }

    return new Result(StatusCodes.OK, tournament, '');
}

export async function validateRoundState(tournament: TournamentData, roundNumber: number) {
    const round = tournament.tournament_start!.rounds.find(r => r.round_number === roundNumber);
    if (!round) {
        return new Result(StatusCodes.BAD_REQUEST, null, TournamentResponseMessages.ERR_ROUND_NOT_FOUND);
    }

    if (round.is_completed) {
        return new Result(StatusCodes.BAD_REQUEST, null, TournamentResponseMessages.ERR_ROUND_COMPLETED);
    }

    if (round.round_number !== roundNumber) {
        return new Result(StatusCodes.BAD_REQUEST, null, TournamentResponseMessages.ERR_ROUND_NUMBER_MISMATCH);
    }

    return new Result(StatusCodes.OK, round, '');
}

export async function validateWinners(winner: Participant, round: Round, existingWinners: Participant[]) {
    const isValidWinner = round.matches.find(match =>
        (match.participant1.uuid === winner.uuid) ||
        (match.participant2.uuid === winner.uuid)
    );

    if (!isValidWinner) {
        return new Result(StatusCodes.BAD_REQUEST, null, TournamentResponseMessages.ERR_WINNER_NOT_IN_MATCHES);
    }

    const rivalUUID = isValidWinner.participant1.uuid === winner.uuid
        ? isValidWinner.participant2.uuid
        : isValidWinner.participant1.uuid;

    const isRivalAlreadyWon = existingWinners.some(w => w.uuid === rivalUUID);
    if (isRivalAlreadyWon) {
        return new Result(StatusCodes.BAD_REQUEST, null, TournamentResponseMessages.ERR_RIVAL_ALREADY_WON);
    }

    const isWinnerAlreadyAdded = existingWinners.some(w => w.uuid === winner.uuid);
    if (isWinnerAlreadyAdded) {
        return new Result(StatusCodes.CONFLICT, null, TournamentResponseMessages.ERR_WINNER_ALREADY_ADDED);
    }

    return new Result(StatusCodes.OK, null, '');
}

export async function isAllMatchesCompleted(matches: Match[]) {
    return matches.every(match => match.status === MatchStatus.COMPLETED || match.status === MatchStatus.CANCELLED);
}