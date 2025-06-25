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

const start = async () => {
    try {
        await server.listen({ port: 8083 });
        console.log('Server is running on http://localhost:8080');
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

start()
    .then(() => {
        console.log('Server started successfully');
    })
    .catch((err) => {
        console.error('Error starting server:', err);
});
