import { FastifyInstance } from 'fastify';
import {
    addWinners,
    createTournament,
    deleteTournament, getTournamentParticipants,
    joinTournament,
    leaveTournament, startTournament
} from '../controllers/tournament.controller';

export default async function tournamentRoutes(server: FastifyInstance) {
    server.post('/tournament', createTournament);
    server.post('/tournament/:code/join', joinTournament);
    server.post('/tournament/:code/leave', leaveTournament);
    server.delete('/tournament/:code', deleteTournament);
    server.post('/tournament/:code/start', startTournament);
    server.get('/tournament/:code', getTournamentParticipants);
    server.patch('/tournament/:code', addWinners);
}
