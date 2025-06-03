import database from '../database/db';
import {User} from '../entities/user';

export async function saveUser(user: any){
    database
        .prepare('INSERT INTO users (uuid, username, email, password) VALUES (?, ?, ?, ?)')
        .run(user.uuid, user.username, user.email, user.password);
}

export async function findUserByEmail(email: string): Promise<User | null> {
    return database
        .prepare('SELECT * FROM users WHERE email = ?')
        .get(email) as User | null;
}

export async function findUserByUuid(uuid: string): Promise<User | null> {
    return database
        .prepare('SELECT * FROM users WHERE uuid = ?')
        .get(uuid) as User | null;
}

export async function updateUserRepository(user: Partial<User>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    if (user.username !== undefined) {
        fields.push("username = ?");
        values.push(user.username);
    }

    if (user.email !== undefined) {
        fields.push("email = ?");
        values.push(user.email);
    }

    if (user.password !== undefined) {
        fields.push("password = ?");
        values.push(user.password);
    }

    if (fields.length === 0) return;

    values.push(user.uuid);

    database
        .prepare(`UPDATE users SET ${fields.join(", ")} WHERE uuid = ?`)
        .run(...values);
}