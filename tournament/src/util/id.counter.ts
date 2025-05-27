let roomIdCounter = 100;
let userIdCounter = 1;

export function getNextRoomId(): number {
    return roomIdCounter++;
}

export function getNextUserId(): number {
    return userIdCounter++;
}