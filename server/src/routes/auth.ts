import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { initDb } from '../db/setup';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(`Login attempt for username: "${username}"`);
    
    const db = await initDb();
    const admin = await db.get('SELECT * FROM admins WHERE username = ?', [username]);

    if (!admin) {
        console.log(`Login failed: User "${username}" not found.`);
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
        console.log(`Login failed: Incorrect password for user "${username}".`);
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log(`Login successful for user: "${username}"`);
    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
});

export default router;
