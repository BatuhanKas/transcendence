import { FastifyInstance } from 'fastify';
import { createTournament } from '../controllers/tournament.controller';

export default async function tournamentRoutes(server: FastifyInstance) {
    server.post('/tournament', createTournament);
}
