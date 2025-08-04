import {FastifyInstance} from "fastify";
import * as AuthController from "../controllers/auth.controller";
import * as UserController from "../controllers/user.controller";

export default async function routes(server: FastifyInstance) {
    /**
     * User Authentication Routes
     */
    server.post('/auth/login', AuthController.login);
    server.post('/auth/register', AuthController.register);
    server.post('/auth/validate', AuthController.validate);

    /**
     * User Management Routes
     */
    server.put('/auth/:uuid', UserController.update);

    /**
     * Health Check Route
     */
    server.get('/health', async () => {
        return {status: 'OK'};
    })
}