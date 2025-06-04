import { FastifyInstance } from 'fastify';
import {
    createTournament,
    deleteTournament, getTournamentParticipants,
    joinTournament,
    leaveTournament
} from '../controllers/tournament.controller';

export default async function tournamentRoutes(server: FastifyInstance) {
    server.post('/tournament', createTournament);
    server.post('/tournament/:code/join', joinTournament);
    server.post('/tournament/:code/leave', leaveTournament);
    server.delete('/tournament/:code', deleteTournament);
    server.get('/tournament/:code', getTournamentParticipants);
}
