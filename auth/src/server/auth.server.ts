import Fastify from "fastify";
import authRoutes from "../routes/auth.routes";
import jwt from "@fastify/jwt";
import 'dotenv/config';

const authServer = Fastify();

if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined in .env file');
    process.exit(1);
}

authServer.register(authRoutes, { prefix: '/api' });
authServer.register(jwt, {
    secret: process.env.JWT_SECRET || "super-secret-key",
    sign: {
        expiresIn: '1h'
    }
});

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
