import database from '../database/db';

export async function saveUser(user: any){
    database
        .prepare('INSERT INTO users (uuid, username, email, password) VALUES (?, ?, ?, ?)')
        .run(user.uuid, user.username, user.email, user.password);
}