import Fastify from 'fastify';
import tournamentRoutes from "../routes/routes";

const server = Fastify();

server.get('/hello', async (req, reply) => {
    return { msg: 'Hello from Fastify!' };
});

server.register(tournamentRoutes, { prefix: '/tournament' });

const start = async () => {
    try {
        await server.listen({ port: 8080 });
        console.log('Server is running on http://localhost:8080');
    } catch (err) {
        server.log.error(err);
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
