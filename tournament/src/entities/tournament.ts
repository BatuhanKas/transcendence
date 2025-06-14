import { Participant } from "./participant";

export type TournamentData = {
    id: number;
    code: string;
    name: string;
    admin_id: string;
    participants: Participant[];
    status: 'created' | 'ongoing' | 'completed';
};

export type TournamentStart = TournamentData &{
    code: string;
    participants: Participant[];
    rounds: [
        {
            round_number: number;
            matches: Match[];
            winner: Participant[] | null;
        }
    ]
}

export type Match = {
    participant1: Participant;
    participant2: Participant;
}