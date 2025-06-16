import {TournamentData, TournamentStatus} from "../entities/tournament";
import Result from "../bean/result";
import {StatusCodes} from "http-status-codes";

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