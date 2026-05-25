import React from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="logo">
          Entrep<span>Store</span>
        </Link>
        <div className="nav-links">
          <Link to="/products">Catalog</Link>
          <Link to="/admin" className="admin-link">
            <User size={20} />
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
