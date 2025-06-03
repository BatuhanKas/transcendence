import { customAlphabet } from 'nanoid';

let roomIdCounter = 0;

const generateRoomCode = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 6);

export function getRoomCode(): string {
    return generateRoomCode();
}

export function getNextRoomId(): number {
    return ++roomIdCounter;
}