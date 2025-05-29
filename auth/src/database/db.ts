import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_DIRECTORY = path.resolve(__dirname, './sqlite');
const DB_PATH = path.resolve(DB_DIRECTORY, 'data.sqlite');

if (!fs.existsSync(DB_DIRECTORY)) {
    fs.mkdirSync(DB_DIRECTORY, { recursive: true });
}

const db = new Database(DB_PATH);

db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
     id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
     uuid TEXT NOT NULL UNIQUE,
     username TEXT NOT NULL,
     email TEXT NOT NULL UNIQUE,
     password TEXT NOT NULL,
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`).run();

export default db;