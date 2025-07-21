import { FastifyInstance } from 'fastify';
import {
    addWinners,
    createTournament,
    deleteTournament, getTournamentCodeByUUID, getTournamentParticipants, joinMatch,
    joinTournament,
    leaveTournament, startTournament
} from '../controllers/tournament.controller';

/**
 * Tournament routes with the Fastify server instance.
 * @param server
 */
export default async function tournamentRoutes(server: FastifyInstance) {
    /**
     * Creates a new tournament.
     * @route POST /tournament
     * @returns {object} 201 - The created tournament object.
     * @returns {Error} 400 - Invalid input.
     */
    server.post('/tournament', createTournament);

    /**
     * Join a tournament using its code
     * @route POST /tournament/:code/join
     * @param {string} code.path.required - Tournament code
     * @returns {object} 200 - Successfully joined
     * @returns {Error} 404 - Tournament not found
     */
    server.post('/tournament/:code/join', joinTournament);

    server.post('/tournament/:code/leave', leaveTournament);
    server.delete('/tournament/:code', deleteTournament);
    server.post('/tournament/:code/start', startTournament);

    /**
     * Get tournament
     * @route GET /tournament/:code
     * @param {string} code.path.required - Tournament code
     * @returns {TournamentData} 200 - Tournament
     * @returns {Error} 404 - Tournament not found
     */
    server.get('/tournament/:code', getTournamentParticipants);

    /**
     * Add winners to new round of a tournament
     * @route PATCH /tournament/:code
     * @param {string} code.path.required - Tournament code
     * @returns {object} 200 - Winners added successfully
     * @returns {Error} 400 - Invalid winners data
     */
    server.patch('/tournament/:code', addWinners);
    server.patch('/tournament/:code/join-match', joinMatch);

    /**
     * Get tournament code by UUID
     * @route GET /tournament/:uuid
     * @param {string} uuid.path.required - Tournament UUID
     * @returns {object} 200 - Tournament code
     * @returns {Error} 404 - Tournament not found
     */
    server.get('/tournament/uuid/:uuid', getTournamentCodeByUUID);
}
