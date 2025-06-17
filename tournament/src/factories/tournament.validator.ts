import {Round, TournamentData, TournamentStatus} from "../entities/tournament";
import Result from "../bean/result";
import {StatusCodes} from "http-status-codes";
import {Participant} from "../entities/participant";

export async function validateTournamentState(tournament: TournamentData) {
    if (tournament.status !== TournamentStatus.ONGOING) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Tournament is not in a state to add winners');
    }

    if (!tournament.tournament_start || !tournament.tournament_start.rounds) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'No rounds found in the tournament');
    }

    return new Result(StatusCodes.OK, tournament, '');
}

export async function validateRoundState(tournament: TournamentData, roundNumber: number) {
    const round = tournament.tournament_start!.rounds.find(r => r.round_number === roundNumber);
    if (!round) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Round not found');
    }

    const currentRound = tournament.tournament_start!.rounds.find(r => !r.is_completed);
    if (!currentRound) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'No active round found');
    }

    return new Result(StatusCodes.OK, currentRound, '');
}

export async function validateWinners(winner: Participant, round: Round, existingWinners: Participant[]) {
    const isValidWinner = round.matches.find(match =>
        (match.participant1.uuid === winner.uuid) ||
        (match.participant2.uuid === winner.uuid)
    );

    if (!isValidWinner) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Winner is not part of the current matches');
    }

    const rivalUUID = isValidWinner.participant1.uuid === winner.uuid
        ? isValidWinner.participant2.uuid
        : isValidWinner.participant1.uuid;

    const isRivalAlreadyWon = existingWinners.some(w => w.uuid === rivalUUID);
    if (isRivalAlreadyWon) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Rival participant has already won in this round');
    }

    const isWinnerAlreadyAdded = existingWinners.some(w => w.uuid === winner.uuid);
    if (isWinnerAlreadyAdded) {
        return new Result(StatusCodes.CONFLICT, null, 'Winner has already been added for this round');
    }

    return new Result(StatusCodes.OK, null, '');
}
