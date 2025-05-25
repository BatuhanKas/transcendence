// import { getTournamentByIdRepository } from '../services/tournament.repository';

export async function getTournamentByIdService(id: string) {
    if (!id) {
        throw new Error('Tournament ID is required');
    }
    const tournament = 123;
    if (!tournament) {
        throw new Error('Tournament not found');
    }
    return tournament;
}
