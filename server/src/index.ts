import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './db/setup';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import salesRoutes from './routes/sales';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);

// Initialize DB and start server
initDb().then((db) => {
    console.log('Database connected.');

    // Health check
    app.get('/api/health', (req, res) => {
        res.json({ status: 'ok' });
    });

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
}).catch(err => {
    console.error('Failed to initialize database:', err);
});
