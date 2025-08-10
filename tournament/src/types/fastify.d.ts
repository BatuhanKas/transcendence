import {Participant} from "../entities/participant";

declare module 'fastify' {
    export interface FastifyRequest {
        participant?: Participant;
    }
}
