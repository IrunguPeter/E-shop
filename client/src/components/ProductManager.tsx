import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit } from 'lucide-react';
import './ProductManager.css';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
}

const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Rice',
    price: '',
    description: '',
    image_url: ''
  });

  const token = localStorage.getItem('adminToken');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:5000/api/products');
    setProducts(res.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axios.put(`http://localhost:5000/api/products/${editingProduct.id}`, formData, { headers });
      } else {
        await axios.post('http://localhost:5000/api/products', formData, { headers });
      }
      setShowModal(false);
      setEditingProduct(null);
      setFormData({ name: '', category: 'Rice', price: '', description: '', image_url: '' });
      fetchProducts();
    } catch (err) {
      alert('Error saving product');
    }
  };

  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      category: p.category,
      price: p.price.toString(),
      description: p.description,
      image_url: p.image_url
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await axios.delete(`http://localhost:5000/api/products/${id}`, { headers });
      fetchProducts();
    }
  };

  return (
    <div className="product-manager">
      <div className="manager-header">
        <h2>Manage Products</h2>
        <button className="btn btn-primary add-btn" onClick={() => { setShowModal(true); setEditingProduct(null); }}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>KSh {p.price.toLocaleString()}</td>
              <td>
                <button onClick={() => handleEdit(p)} className="action-btn edit"><Edit size={16} /></button>
                <button onClick={() => handleDelete(p.id)} className="action-btn delete"><Trash2 size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select 
                  value={formData.category} 
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Rice">Rice</option>
                  <option value="Phones">Phones</option>
                  <option value="Digital">Digital</option>
                </select>
              </div>
              <div className="form-group">
                <label>Price (KSh)</label>
                <input 
                  type="number" 
                  value={formData.price} 
                  onChange={(e) => setFormData({...formData, price: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input 
                  type="text" 
                  value={formData.image_url} 
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})} 
                />
              </div>
              <div className="modal-btns">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManager;
