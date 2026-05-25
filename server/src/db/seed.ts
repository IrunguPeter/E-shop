import { initDb } from './setup';

async function seed() {
    const db = await initDb();

    // Sample Products with realistic KSh prices
    const products = [
        { name: 'Premium Basmati Rice (25kg)', category: 'Rice', price: 4500, description: 'High quality long-grain aged basmati rice.', image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=1000' },
        { name: 'iPhone 15 Pro (256GB)', category: 'Phones', price: 185000, description: 'Titanium design, A17 Pro chip, 48MP main camera.', image_url: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=1000' },
        { name: 'Samsung Galaxy S24 Ultra', category: 'Phones', price: 165000, description: 'AI-powered smartphone with stunning display.', image_url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=1000' },
        { name: 'Digital SEO Audit', category: 'Digital', price: 15000, description: 'Comprehensive SEO report for your website.', image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000' },
        { name: 'Social Media Management', category: 'Digital', price: 35000, description: 'Monthly management of your business socials.', image_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1000' }
    ];

    // Clear existing products to avoid mixed currencies in sample data
    await db.run('DELETE FROM sales');
    await db.run('DELETE FROM products');

    for (const p of products) {
        await db.run(
            'INSERT INTO products (name, category, price, description, image_url) VALUES (?, ?, ?, ?, ?)',
            [p.name, p.category, p.price, p.description, p.image_url]
        );
    }

    // Sample Sales
    const dbProducts = await db.all('SELECT id, price FROM products');
    
    for (let i = 0; i < 25; i++) {
        const product = dbProducts[Math.floor(Math.random() * dbProducts.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 10));
        
        await db.run(
            'INSERT INTO sales (product_id, quantity, total_price, sale_date) VALUES (?, ?, ?, ?)',
            [product.id, quantity, product.price * quantity, date.toISOString()]
        );
    }
    
    console.log('Sample data seeded with KSh prices.');
    console.log('Seeding complete.');
}

seed().catch(console.error);
