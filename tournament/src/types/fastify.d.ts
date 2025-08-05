import {FastifyRequest as OriginalFastifyRequest} from "fastify";
import {Participant} from "../entities/participant";

declare module 'fastify' {
    export interface FastifyRequest extends OriginalFastifyRequest {
        participant?: Participant;
    }
}
