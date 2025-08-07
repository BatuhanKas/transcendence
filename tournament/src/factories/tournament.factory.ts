import {Participant, ParticipantStatus} from "../entities/participant";
import {Match, MatchStatus, Round} from "../entities/tournament";
import {getEpochTime} from "../util/get_time";

export const createMatches = (shuffledParticipants: Participant[]) => {
    const matches: Match[] = [];
    for (let i = 0; i < shuffledParticipants.length; i += 2) {
        const firstParticipant = {...shuffledParticipants[i]};
        firstParticipant.status = ParticipantStatus.DISCONNECTED;

        const secondParticipant = {...shuffledParticipants[i + 1]};
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
        expired_at: getEpochTime(5),
        matches: matches,
        winners: winners.length > 0 ? winners : [],
        expected_winner_count: matches.length,
        is_completed: false
    }
    return newRound;
}