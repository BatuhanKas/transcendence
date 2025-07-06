import {Participant, ParticipantStatus} from "../entities/participant";
import {Match, MatchStatus, Round} from "../entities/tournament";

export const createMatches = (shuffledParticipants: Participant[]) => {
    const matches: Match[] = [];
    for (let i = 0; i < shuffledParticipants.length; i += 2) {
        const firstParticipant = { ...shuffledParticipants[i] };
        firstParticipant.status = ParticipantStatus.DISCONNECTED;

        const secondParticipant = { ...shuffledParticipants[i + 1] };
        secondParticipant.status = ParticipantStatus.DISCONNECTED;

        const match: Match = {
            participant1: firstParticipant,
            participant2: secondParticipant,
            status: MatchStatus.CREATED
        }
        matches.push(match);
    }
    return matches;
}

export const createRound = (matches: Match[], winners: any[], roundNumber: number) => {
    const newRound: Round = {
        round_number: roundNumber,
        matches: matches,
        winners: winners.length > 0 ? winners : null,
        expected_winner_count: matches.length,
        is_completed: false
    }
    return newRound;
}