import { FastifyInstance } from 'fastify';
import { getTournamentById } from '../controllers/tournament.controller';

export default async function tournamentRoutes(server: FastifyInstance) {
    server.get('/:id', getTournamentById);
}
