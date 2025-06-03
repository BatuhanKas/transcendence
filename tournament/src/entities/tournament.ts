import { Participant } from "./participant";

export type TournamentData = {
    id: number;
    code: string;
    name: string;
    admin_id: string;
    participants: Participant[];
    status: 'created' | 'ongoing' | 'completed';
};