import { FastifyInstance } from 'fastify';
import {
    createTournament,
    deleteTournament, getTournamentParticipants,
    joinTournament,
    leaveTournament
} from '../controllers/tournament.controller';

export default async function tournamentRoutes(server: FastifyInstance) {
    server.post('/tournament', createTournament);
    server.post('/tournament/:id/join', joinTournament);
    server.post('/tournament/:id/leave', leaveTournament);
    server.delete('/tournament/:id', deleteTournament);
    server.get('/tournament/:id/participants', getTournamentParticipants);
}
