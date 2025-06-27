import Fastify from 'fastify';
import tournamentRoutes from "../routes/routes";
import fastifyCors from "@fastify/cors";

const server = Fastify();

server.register(tournamentRoutes, { prefix: '/api' });
server.register(fastifyCors, {
    origin: 'http://tournament.transendence.com',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
});

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
