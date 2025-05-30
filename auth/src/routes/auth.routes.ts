import {FastifyInstance} from "fastify";
import {login, register, validate} from "../controllers/auth.controller";

export default async function authRoutes(server: FastifyInstance) {
    server.post('/auth/login', login);
    server.post('/auth/register', register);
    server.post('/auth/validate', validate);
}