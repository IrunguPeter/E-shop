import { Router } from 'express';
import { initDb } from '../db/setup';
import { authenticate } from './products';

const router = Router();

// Admin: Log a sale
router.post('/', authenticate, async (req, res) => {
    const { product_id, quantity } = req.body;
    const db = await initDb();

    try {
        const product = await db.get('SELECT price FROM products WHERE id = ?', [product_id]);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        const total_price = product.price * quantity;
        await db.run(
            'INSERT INTO sales (product_id, quantity, total_price) VALUES (?, ?, ?)',
            [product_id, quantity, total_price]
        );
        res.status(201).json({ success: true });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

// Admin: Get sales stats
router.get('/stats', authenticate, async (req, res) => {
    const db = await initDb();

    try {
        // Total revenue
        const totalRevenue = await db.get('SELECT SUM(total_price) as total FROM sales');
        
        // Daily revenue (last 7 days)
        const dailyRevenue = await db.all(`
            SELECT date(sale_date) as date, SUM(total_price) as total
            FROM sales
            WHERE sale_date > date('now', '-7 days')
            GROUP BY date(sale_date)
            ORDER BY date ASC
        `);

        // Best sellers
        const bestSellers = await db.all(`
            SELECT p.name, SUM(s.quantity) as total_quantity
            FROM sales s
            JOIN products p ON s.product_id = p.id
            GROUP BY s.product_id
            ORDER BY total_quantity DESC
            LIMIT 5
        `);

        // Worst sellers (least sold)
        const worstSellers = await db.all(`
            SELECT p.name, COALESCE(SUM(s.quantity), 0) as total_quantity
            FROM products p
            LEFT JOIN sales s ON p.id = s.product_id
            GROUP BY p.id
            ORDER BY total_quantity ASC
            LIMIT 5
        `);

        res.json({
            totalRevenue: totalRevenue?.total || 0,
            dailyRevenue,
            bestSellers,
            worstSellers
        });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
