import {Participant} from "../entities/participant";
import {Match, Round} from "../entities/tournament";
import {getRoundNumber} from "../util/id.counter";
import roundWinners from "../cache/winners.cache";

export const createMatches = (shuffledParticipants: Participant[]) => {
    const matches: Match[] = [];
    for (let i = 0; i < shuffledParticipants.length; i += 2) {
        const match: Match = {
            participant1: shuffledParticipants[i],
            participant2: shuffledParticipants[i + 1]
        }
        matches.push(match);
    }
    return matches;
}

export const createRound = (matches: Match[], winners: any[]) => {
    const newRound: Round = {
        round_number: getRoundNumber(),
        matches: matches,
        winner: winners.length > 0 ? winners : null,
        expected_winner_count: matches.length,
        is_completed: false
    }
    roundWinners.set(newRound.round_number, winners);
    return newRound;
}