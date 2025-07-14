import { Participant } from "./participant";

export enum TournamentStatus {
    CREATED = 'created',
    ONGOING = 'ongoing',
    COMPLETED = 'completed'
}

export enum MatchStatus {
    CREATED = 'created',
    WAITING_PLAYER = 'waiting_player',
    ONGOING = 'ongoing',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
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
    rounds: Round[];
}

export type Round = {
    round_number: number;
    matches: Match[];
    winners: Participant[] | null;
    expected_winner_count: number;
    is_completed: boolean;
}

export type Match = {
    participant1: Participant;
    participant2: Participant;
    status: MatchStatus;
}