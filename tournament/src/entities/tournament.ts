import { Participant } from "./participant";

export enum TournamentStatus {
    CREATED = 'created',
    ONGOING = 'ongoing',
    COMPLETED = 'completed'
}

export type TournamentData = {
    id: number;
    code: string;
    name: string;
    admin_id: string;
    participants: Participant[];
    status: TournamentStatus
    start_time?: Date;
    end_time?: Date;
    tournament_start?: TournamentStart | null;
};

export type TournamentStart = {
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