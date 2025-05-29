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

// export async function findUserByUUID(uuid: string): Promise<User | null> {
//     return database
//         .prepare('SELECT * FROM users WHERE uuid = ?')
//         .get(uuid);
// }