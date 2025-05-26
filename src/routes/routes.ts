import { FastifyInstance } from 'fastify';
import {createTournament, joinTournament} from '../controllers/tournament.controller';

export default async function tournamentRoutes(server: FastifyInstance) {
    server.post('/tournament', createTournament);
    server.post('/tournament/:id/join', joinTournament);
}
