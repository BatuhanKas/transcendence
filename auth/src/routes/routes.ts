import {FastifyInstance} from "fastify";
import {login, register, validate} from "../controllers/auth.controller";
import {update} from "../controllers/user.controller";

export default async function routes(server: FastifyInstance) {
    /**
     * User Authentication Routes
     */
    server.post('/auth/login', login);
    server.post('/auth/register', register);
    server.post('/auth/validate', validate);

    /**
     * User Management Routes
     */
    server.put('/auth/:uuid', update);
}