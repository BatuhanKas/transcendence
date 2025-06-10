import Fastify from 'fastify';
import tournamentRoutes from "../routes/routes";

const server = Fastify();

server.register(tournamentRoutes, { prefix: '/api' });

const start = async () => {
    try {
        await server.listen({ port: 8080 });
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
