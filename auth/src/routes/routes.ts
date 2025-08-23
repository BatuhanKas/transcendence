import {FastifyInstance} from "fastify";
import {AuthController} from "../controllers/auth.controller";
import {UserController} from "../controllers/user.controller";
import {authSchemas, systemSchemas, userSchemas} from "../schemas/swagger.schemas";

export default async function routes(server: FastifyInstance) {
    /**
     * User Authentication Routes
     */
    server.post('/auth/login', {
        schema: authSchemas.login,
        handler: AuthController.login
    });

    server.post('/auth/register', {
        schema: authSchemas.register,
        handler: AuthController.register
    });

    server.post('/auth/validate', {
        schema: authSchemas.validate,
        handler: AuthController.validate
    });

    server.post('/auth/send-mail', {
        schema: authSchemas.sendMail,
        handler: AuthController.sendMail
    })

    server.patch('/auth/verify', {
        handler: AuthController.verify
    })

    /**
     * User Management Routes
     */
    server.put('/auth/:uuid', {
        schema: userSchemas.update,
        handler: UserController.update
    });

    /**
     * Health Check Route
     */
    server.get('/health', {
        schema: systemSchemas.health
    }, async () => {
        return {status: 'OK'};
    });
}