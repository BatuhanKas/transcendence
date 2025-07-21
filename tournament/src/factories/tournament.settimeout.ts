import tournamentCache from "../cache/tournament.cache";
import {MatchStatus, TournamentStatus} from "../entities/tournament";
import {addWinnerService} from "../services/tournament.service";

export async function setTimeoutFunc(code: string, roundNumber: number) {
    setTimeout(() => {
        const tournament = tournamentCache.get(code);
        if (!tournament || tournament.status !== TournamentStatus.ONGOING) {
            return;
        }

        const round = tournament.tournament_start!.rounds.find(r => r.round_number === roundNumber);
        if (!round || round.is_completed) {
            return;
        }

        let hasActiveMatches = false;
        for (const match of round.matches) {
            if (match.status === MatchStatus.CREATED) {
                match.status = MatchStatus.CANCELLED;
                tournament.participants = tournament.participants.filter(p => p.uuid !== match.participant1.uuid && p.uuid !== match.participant2.uuid);
                round.expected_winner_count--;
            } else if (match.status === MatchStatus.WAITING_PLAYER ||
                match.status === MatchStatus.ONGOING) {
                hasActiveMatches = true;
            }
        }

        const existingWinners = round.winners || [];
        if (!hasActiveMatches && existingWinners.length >= round.expected_winner_count) {
            addWinnerService(code, {
                round_number: roundNumber,
                winner: null as any
            });
        } else if (hasActiveMatches) {
            setTimeoutFunc(code, roundNumber);
        }

        tournament.tournament_start!.rounds = tournament.tournament_start!.rounds.map(r => r.round_number === roundNumber ? round : r);
        tournamentCache.set(code, tournament);

    },5 * 60 * 1000);
}