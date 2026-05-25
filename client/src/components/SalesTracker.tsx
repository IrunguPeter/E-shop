import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';
import { PlusCircle } from 'lucide-react';
import './SalesTracker.css';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface Stats {
  totalRevenue: number;
  dailyRevenue: { date: string, total: number }[];
  bestSellers: { name: string, total_quantity: number }[];
  worstSellers: { name: string, total_quantity: number }[];
}

const SalesTracker: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [saleData, setSaleData] = useState({ product_id: '', quantity: 1 });

  const token = localStorage.getItem('adminToken');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchStats();
    fetchProducts();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/sales/stats', { headers });
      setStats(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching stats', err);
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:5000/api/products');
    setProducts(res.data);
  };

  const handleLogSale = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/sales', {
        product_id: parseInt(saleData.product_id),
        quantity: saleData.quantity
      }, { headers });
      setShowSaleModal(false);
      setSaleData({ product_id: '', quantity: 1 });
      fetchStats();
    } catch (err) {
      alert('Error logging sale');
    }
  };

  if (loading || !stats) return <p>Loading stats...</p>;

  return (
    <div className="sales-tracker">
      <div className="tracker-header">
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-value">KSh {stats.totalRevenue.toLocaleString()}</p>
        </div>
        <button className="btn btn-primary log-sale-btn" onClick={() => setShowSaleModal(true)}>
          <PlusCircle size={18} /> Record New Sale
        </button>
      </div>

      <div className="charts-container">
        <div className="chart-box">
          <h3>Daily Revenue (Last 7 Days)</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#0a192f" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-box">
          <h3>Best Sellers (Quantity)</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.bestSellers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total_quantity" fill="#ffd700">
                   {stats.bestSellers.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#0a192f' : '#ffd700'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="tables-container">
        <div className="table-box">
          <h3>Least Sold Items</h3>
          <table className="mini-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty Sold</th>
              </tr>
            </thead>
            <tbody>
              {stats.worstSellers.map((item, i) => (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td>{item.total_quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showSaleModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Record a Transaction</h3>
            <form onSubmit={handleLogSale}>
              <div className="form-group">
                <label>Select Product</label>
                <select 
                  value={saleData.product_id} 
                  onChange={(e) => setSaleData({...saleData, product_id: e.target.value})}
                  required
                >
                  <option value="">-- Choose Product --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - KSh {p.price}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input 
                  type="number" 
                  min="1"
                  value={saleData.quantity} 
                  onChange={(e) => setSaleData({...saleData, quantity: parseInt(e.target.value)})} 
                  required 
                />
              </div>
              <div className="modal-btns">
                <button type="button" onClick={() => setShowSaleModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Log Sale</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesTracker;
