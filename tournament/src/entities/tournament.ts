import { Participant } from "./participant";

export type TournamentData = {
    id: number;
    name: string;
    // admin_id: string;
    participants: Participant[];
    status: 'created' | 'ongoing' | 'completed';
};