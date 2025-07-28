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
    lobby_members: Participant[];
    participants: Participant[];
    status: TournamentStatus
    start_time?: string;
    end_time?: string;
    tournament_start?: TournamentStart | null;
};

export type TournamentStart = {
    rounds: Round[];
}

export type Round = {
    round_number: number;
    expired_at?: string;
    matches: Match[];
    winners: Participant[] | null;
    expected_winner_count: number;
    is_completed: boolean;
}

export type Match = {
    expired_at?: string;
    participant1: Participant;
    participant2: Participant;
    status: MatchStatus;
}