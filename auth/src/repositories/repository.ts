import database from '../database/db';
import {User} from '../entities/user';

async function saveUser(user: any) {
    database
        .prepare('INSERT INTO users (uuid, username, email, password) VALUES (?, ?, ?, ?)')
        .run(user.uuid, user.username, user.email, user.password);
}

async function findUserByUsername(username: string): Promise<User | null> {
    return database
        .prepare('SELECT * FROM users WHERE username = ?')
        .get(username) as User | null;
}

async function findUserByEmail(email: string): Promise<User | null> {
    return database
        .prepare('SELECT * FROM users WHERE email = ?')
        .get(email) as User | null;
}

async function findUserByUuid(uuid: string): Promise<User | null> {
    return database
        .prepare('SELECT * FROM users WHERE uuid = ?')
        .get(uuid) as User | null;
}

/**
 * * Updates user information in the database.
 * @param user
 */
async function updateUserRepository(user: Partial<User>): Promise<void> {
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

    if (user.verified !== undefined) {
        fields.push("verified = ?");
        values.push(user.verified ? 1 : 0);
    }

    if (fields.length === 0) return;

    values.push(user.uuid);

    database
        .prepare(`UPDATE users
                  SET ${fields.join(", ")}
                  WHERE uuid = ?`)
        .run(...values);
}

async function deleteUserByEmail(email: string): Promise<void> {
    database
        .prepare('DELETE FROM users WHERE email = ?')
        .run(email);
}

export const AuthRepository = {
    saveUser,
    findUserByUsername,
    findUserByEmail,
    findUserByUuid,
    updateUserRepository,
    deleteUserByEmail
}