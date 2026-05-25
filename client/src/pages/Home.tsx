import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Laptop, Utensils } from 'lucide-react';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="container hero-content">
          <h1>Premium Rice & <span className="highlight">Digital Solutions</span></h1>
          <p>Your one-stop shop for high-quality grains, the latest smartphones, and expert digital services.</p>
          <div className="hero-btns">
            <Link to="/products" className="btn btn-primary">Shop Catalog</Link>
            <Link to="/products?category=Digital" className="btn btn-outline">Digital Services</Link>
          </div>
        </div>
      </section>

      <section className="categories container">
        <h2>What We Offer</h2>
        <div className="category-grid">
          <div className="category-card">
            <Utensils size={48} className="icon" />
            <h3>Premium Rice</h3>
            <p>Best quality grains sourced directly from top farms.</p>
          </div>
          <div className="category-card">
            <Smartphone size={48} className="icon" />
            <h3>Smartphones</h3>
            <p>Latest mobile devices at unbeatable prices.</p>
          </div>
          <div className="category-card">
            <Laptop size={48} className="icon" />
            <h3>Digital Services</h3>
            <p>Professional digital assistance for your business needs.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
