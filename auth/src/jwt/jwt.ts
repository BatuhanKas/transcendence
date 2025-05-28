import { FastifyInstance } from "fastify";

export const generateToken = (fastify: FastifyInstance, user: any): string => {
    return fastify.jwt.sign(
        { id: user.id, email: user.email },
        { expiresIn: "1h" }
    );
};
