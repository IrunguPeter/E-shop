import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

export async function initDb() {
    const db = await open({
        filename: path.join(__dirname, '../../database.sqlite'),
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password_hash TEXT
        );

        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            category TEXT,
            price REAL,
            description TEXT,
            image_url TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER,
            quantity INTEGER,
            total_price REAL,
            sale_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products(id)
        );
    `);

    // Create a default admin if none exists
    const admin = await db.get('SELECT * FROM admins LIMIT 1');
    if (!admin) {
        const passwordHash = await bcrypt.hash('admin123', 10);
        await db.run('INSERT INTO admins (username, password_hash) VALUES (?, ?)', ['admin', passwordHash]);
        console.log('Default admin created: admin / admin123');
    }

    return db;
}
