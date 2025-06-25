import Fastify from "fastify";
import routes from "../routes/routes";
import jwt from "@fastify/jwt";
import 'dotenv/config';
import fastifyCors from "@fastify/cors";

const authServer = Fastify();

if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined in .env file');
    process.exit(1);
}

authServer.register(routes, { prefix: '/api' });
authServer.register(jwt, {
    secret: process.env.JWT_SECRET,
    sign: {
        expiresIn: '30d'
    }
});
authServer.register(fastifyCors, {
    origin: 'http://auth.transendence.com',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
})

const start = async () => {
    try {
        await authServer.listen({ port: 8081 });
        console.log('Authentication server is running on http://auth.transendence.com:8081');
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
