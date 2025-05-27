import Fastify from "fastify";
import authRoutes from "../routes/auth.routes";

const authServer = Fastify();

authServer.register(authRoutes, { prefix: '/api' });

const start = async () => {
    try {
        await authServer.listen({ port: 8081 });
        console.log('Authentication server is running on http://localhost:8081');
    } catch (err) {
        authServer.log.error(err);
        process.exit(1);
    }
};

start()
    .then(() => {
        console.log('Auth server started successfully');
    })
    .catch((err) => {
        console.error('Error starting auth server:', err);
});
