import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { initDb } from '../db/setup';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Auth middleware
export const authenticate = (req: any, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Public: Get all products
router.get('/', async (req, res) => {
    const db = await initDb();
    const products = await db.all('SELECT * FROM products ORDER BY created_at DESC');
    res.json(products);
});

// Admin: Add product
router.post('/', authenticate, async (req, res) => {
    const { name, category, price, description, image_url } = req.body;
    const db = await initDb();
    
    try {
        const result = await db.run(
            'INSERT INTO products (name, category, price, description, image_url) VALUES (?, ?, ?, ?, ?)',
            [name, category, price, description, image_url]
        );
        res.status(201).json({ id: result.lastID });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

// Admin: Update product
router.put('/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    const { name, category, price, description, image_url } = req.body;
    const db = await initDb();

    try {
        await db.run(
            'UPDATE products SET name = ?, category = ?, price = ?, description = ?, image_url = ? WHERE id = ?',
            [name, category, price, description, image_url, id]
        );
        res.json({ success: true });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

// Admin: Delete product
router.delete('/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    const db = await initDb();

    try {
        await db.run('DELETE FROM products WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
