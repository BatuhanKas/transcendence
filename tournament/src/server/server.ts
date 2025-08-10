import Fastify from 'fastify';
import tournamentRoutes from "../routes/routes";
import fastifyCors from "@fastify/cors";
import 'dotenv/config';
import swagger from "@fastify/swagger";
import swaggerUi from '@fastify/swagger-ui'

const server = Fastify();

if (!process.env.X_API_KEY) {
    console.error('X_API_KEY is not defined in .env file');
    process.exit(1);
}

server.register(swagger, {
    swagger: {
        info: {
            title: 'Tournament Server API',
            description: 'Tournament server for Transcendence API List',
            version: '0.1.0'
        },
        host: 'tournament.transendence.com',
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
        tags: [
            {name: 'tournament', description: 'Tournament related endpoints'},
            {name: 'tournament', description: 'System related endpoints'}
        ]
    }
})

server.register(swaggerUi, {
    routePrefix: '/docs'
})

server.register(fastifyCors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
});

server.register(tournamentRoutes, { prefix: '/api' });

/**
 * Start the tournament server
 */
const start = async () => {
    await server.listen({ port: 8083 });
};

start()
    .then(() => {
        console.log('Server is running on http://tournament.transendence.com:8083');
    })
    .catch((err) => {
        console.error('Error starting server:', err);
        process.exit(1);
});
