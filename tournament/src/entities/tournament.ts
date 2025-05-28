import { Participant } from "./participant";

export type TournamentData = {
    id: number;
    name: string;
    participants: Participant[];
    status: 'created' | 'ongoing' | 'completed';
};