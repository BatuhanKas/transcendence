let roomIdCounter = 1;

export function getNextRoomId(): number {
    return roomIdCounter++;
}