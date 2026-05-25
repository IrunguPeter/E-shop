import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Products.css';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products', err);
      setLoading(false);
    }
  };

  const filteredProducts = filter === 'All' 
    ? products 
    : products.filter(p => p.category === filter);

  return (
    <div className="products-page container">
      <div className="products-header">
        <h1>Product Catalog</h1>
        <div className="filters">
          {['All', 'Rice', 'Phones', 'Digital'].map(cat => (
            <button 
              key={cat} 
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="loading">Loading products...</p>
      ) : (
        <div className="product-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image_url || 'https://via.placeholder.com/300x200?text=No+Image'} alt={product.name} />
                <span className="category-tag">{product.category}</span>
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="description">{product.description}</p>
                <div className="product-footer">
                  <span className="price">KSh {product.price.toLocaleString()}</span>
                  <button 
                    className="btn btn-primary buy-btn"
                    onClick={() => alert(`To enquire about ${product.name}, please contact us via WhatsApp or Email.\n\nPhone: +123 456 7890\nEmail: sales@entrepstore.com`)}
                  >
                    Enquire
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && filteredProducts.length === 0 && (
        <p className="no-products">No products found in this category.</p>
      )}
    </div>
  );
};

export default Products;
