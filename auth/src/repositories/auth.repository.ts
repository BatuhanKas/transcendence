import database from '../database/db';

export async function saveUser(user: any){
    database
        .prepare('INSERT INTO users (uuid, username, email, password) VALUES (?, ?, ?, ?)')
        .run(user.uuid, user.username, user.email, user.password);
}

export async function getUserByEmail(email: string) {
    const user = database
        .prepare('SELECT * FROM users WHERE email = ?')
        .get(email);
    return user;
}

export async function getUserByUUID(uuid: string) {
    const user = database
        .prepare('SELECT * FROM users WHERE uuid = ?')
        .get(uuid);
    return user;
}