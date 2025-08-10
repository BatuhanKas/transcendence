import Fastify from "fastify";
import routes from "../routes/routes";
import jwt from "@fastify/jwt";
import 'dotenv/config';
import fastifyCors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from '@fastify/swagger-ui'

const authServer = Fastify();

if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined in .env file');
    process.exit(1);
}

authServer.register(swagger, {
    swagger: {
        info: {
            title: 'Authentication Server API',
            description: 'Authentication server for Transcendence API List',
            version: '0.1.0'
        },
        host: 'auth.transendence.com',
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
        tags: [
            {name: 'auth', description: 'Authentication related endpoints'},
            {name: 'user', description: 'User related endpoints'},
            {name: 'auth', description: 'System related endpoints'}
        ]
    }
})

authServer.register(swaggerUi, {
    routePrefix: '/docs',
})

authServer.register(fastifyCors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
})

authServer.register(jwt, {
    secret: process.env.JWT_SECRET,
    sign: {
        expiresIn: '30d'
    }
});

authServer.register(routes, {prefix: '/api'});

/**
 * * Start the authentication server
 */
const start = async () => {
    await authServer.listen({port: 8081});
};

start()
    .then(() => {
        console.log('Authentication server is running on http://auth.transendence.com:8081');
    })
    .catch((err) => {
        console.error('Error starting auth server:', err);
        process.exit(1);
    });
