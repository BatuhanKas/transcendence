import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.resolve(__dirname, './sqlite/data.sqlite');

const db = new Database(DB_PATH);

db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
     id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
     uuid TEXT NOT NULL UNIQUE,
     username TEXT NOT NULL,
     email TEXT NOT NULL UNIQUE,
     password TEXT,
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`).run();

export default db;