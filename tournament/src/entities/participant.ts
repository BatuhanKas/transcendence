export enum ParticipantStatus {
    DISCONNECTED = 'disconnected',
    JOINED = 'joined',
}

export type Participant = {
    uuid: string;
    username: string;
    status?: ParticipantStatus;
};