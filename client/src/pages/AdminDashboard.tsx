import React, { useState } from 'react';
import { Package, BarChart3, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductManager from '../components/ProductManager';
import SalesTracker from '../components/SalesTracker';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'sales'>('products');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h3>Admin Panel</h3>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={20} />
            <span>Products</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'sales' ? 'active' : ''}`}
            onClick={() => setActiveTab('sales')}
          >
            <BarChart3 size={20} />
            <span>Sales & Stats</span>
          </button>
          <button className="nav-item logout" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>{activeTab === 'products' ? 'Product Management' : 'Sales Analytics'}</h1>
        </header>
        <div className="dashboard-content">
          {activeTab === 'products' ? <ProductManager /> : <SalesTracker />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
