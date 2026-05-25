import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response) {
        // The server responded with a status code outside the 2xx range
        setError(err.response.data.error || 'Invalid username or password');
      } else if (err.request) {
        // The request was made but no response was received
        setError('Cannot connect to server. Please ensure the backend is running on port 5000.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Admin Login</h2>
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary login-btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
