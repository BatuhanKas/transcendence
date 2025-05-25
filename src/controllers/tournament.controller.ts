import { FastifyRequest, FastifyReply } from 'fastify';
import { getTournamentByIdService } from '../services/tournament.service';

export async function getTournamentById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const tournament = await getTournamentByIdService(id);
    return reply.send(tournament);
}
