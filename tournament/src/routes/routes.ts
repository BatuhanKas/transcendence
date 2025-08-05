import {FastifyInstance} from 'fastify';
import * as TournamentController from '../controllers/tournament.controller';
import {authMiddleware} from "../middleware/middleware";

/**
 * Tournament routes with the Fastify server instance.
 * @param server
 */
export default async function tournamentRoutes(server: FastifyInstance) {
    /**
     * Middleware to authenticate requests by validating the token.
     * This middleware checks for a valid API key or token in the request headers.
     */
    server.addHook('preHandler', authMiddleware);

    /**
     * Creates a new tournament.
     * @route POST /tournament
     * @returns {object} 201 - The created tournament object.
     * @returns {Error} 400 - Invalid input.
     */
    server.post('/tournament', {
        preHandler: authMiddleware,
        handler: TournamentController.createTournament
    });

    /**
     * Join a tournament using its code
     * @route POST /tournament/:code/join
     * @param {string} code.path.required - Tournament code
     * @returns {object} 200 - Successfully joined
     * @returns {Error} 404 - Tournament not found
     */
    server.post('/tournament/:code/join', {
        preHandler: authMiddleware,
        handler: TournamentController.joinTournament
    });

    /**
     * Leave a tournament using its code
     * @route POST /tournament/:code/leave
     * @param {string} code.path.required - Tournament code
     * @returns {object} 200 - Successfully left the tournament
     * @returns {Error} 404 - Tournament not found or participant not in tournament
     */
    server.post('/tournament/:code/leave', {
        preHandler: authMiddleware,
        handler: TournamentController.leaveTournament
    });

    /**
     * Delete a tournament using its code
     * @route DELETE /tournament/:code
     * @param {string} code.path.required - Tournament code
     * @returns {object} 200 - Tournament deleted successfully
     * @returns {Error} 404 - Tournament not found or participant not authorized
     */
    server.delete('/tournament/:code', {
        preHandler: authMiddleware,
        handler: TournamentController.deleteTournament
    });

    /**
     * Start a tournament using its code
     * @route POST /tournament/:code/start
     * @param {string} code.path.required - Tournament code
     * @returns {object} 200 - Tournament started successfully
     * @returns {Error} 404 - Tournament not found or not in a state to start
     */
    server.post('/tournament/:code/start', {
        preHandler: authMiddleware,
        handler: TournamentController.startTournament
    });

    /**
     * Get tournament
     * @route GET /tournament/:code
     * @param {string} code.path.required - Tournament code
     * @returns {TournamentData} 200 - Tournament
     * @returns {Error} 404 - Tournament not found
     */
    server.get('/tournament/:code', {
        handler: TournamentController.getTournamentParticipants
    });

    /**
     * Get tournament with UUID
     * @route GET /tournament
     * @param {string} uuid.path.required - Tournament UUID
     * @returns {object} 200 - Tournament
     * @returns {Error} 404 - Tournament not found
     */
    server.get('/tournament', {
        preHandler: authMiddleware,
        handler: TournamentController.getTournamentByUUID
    });

    /**
     * Add winners to new round of a tournament
     * @route PATCH /tournament/:code
     * @param {string} code.path.required - Tournament code
     * @returns {object} 200 - Winners added successfully
     * @returns {Error} 400 - Invalid winners data
     */
    server.patch('/tournament/:code', TournamentController.addWinners);

    /**
     * Join a match in a tournament
     * @route PATCH /tournament/:code/join-match
     * @param {string} code.path.required - Tournament code
     * @param {string} participantId.query.required - Participant UUID
     * @returns {object} 200 - Successfully joined match
     * @returns {Error} 404 - Tournament or match not found
     */
    server.patch('/tournament/:code/join-match', TournamentController.joinMatch);

    /**
     * Health check route
     */
    server.get('/health', async () => {
        return {status: 'OK'};
    })
}
