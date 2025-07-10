import {Participant} from "./participant";

export type Winner = {
    round_number: number;
    winner: Participant;
};

/**
 * Represents a participant in a match, including the round number and participant details.
 */
export type MatchParticipant = {
    round_number: number;
    participant: Participant;
}