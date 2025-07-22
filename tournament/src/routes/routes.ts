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

    /**
     * Leave a tournament using its code
     * @route POST /tournament/:code/leave
     * @param {string} code.path.required - Tournament code
     * @returns {object} 200 - Successfully left the tournament
     * @returns {Error} 404 - Tournament not found or participant not in tournament
     */
    server.post('/tournament/:code/leave', leaveTournament);

    /**
     * Delete a tournament using its code
     * @route DELETE /tournament/:code
     * @param {string} code.path.required - Tournament code
     * @returns {object} 200 - Tournament deleted successfully
     * @returns {Error} 404 - Tournament not found or participant not authorized
     */
    server.delete('/tournament/:code', deleteTournament);

    /**
     * Start a tournament using its code
     * @route POST /tournament/:code/start
     * @param {string} code.path.required - Tournament code
     * @returns {object} 200 - Tournament started successfully
     * @returns {Error} 404 - Tournament not found or not in a state to start
     */
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
     * Get tournament code by UUID
     * @route GET /tournament/:uuid
     * @param {string} uuid.path.required - Tournament UUID
     * @returns {object} 200 - Tournament code
     * @returns {Error} 404 - Tournament not found
     */
    server.get('/tournament/uuid/:uuid', getTournamentCodeByUUID);

    /**
     * Add winners to new round of a tournament
     * @route PATCH /tournament/:code
     * @param {string} code.path.required - Tournament code
     * @returns {object} 200 - Winners added successfully
     * @returns {Error} 400 - Invalid winners data
     */
    server.patch('/tournament/:code', addWinners);

    /**
     * Join a match in a tournament
     * @route PATCH /tournament/:code/join-match
     * @param {string} code.path.required - Tournament code
     * @param {string} participantId.query.required - Participant UUID
     * @returns {object} 200 - Successfully joined match
     * @returns {Error} 404 - Tournament or match not found
     */
    server.patch('/tournament/:code/join-match', joinMatch);
}
