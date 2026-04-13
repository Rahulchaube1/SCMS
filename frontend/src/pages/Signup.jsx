import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../config';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(apiUrl('/api/auth/register'), formData);
      alert('Account created! Please log in.');
      navigate('/login');
    } catch (err) {
      alert('Signup failed: ' + (err.response?.data?.message || 'Error'));
    }
  };

  const handleGuestLogin = async () => {
    try {
      const res = await axios.post(apiUrl('/api/auth/guest-login'));
      const { token, ...user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = '/'; // Simple logic for signup page
    } catch {
      alert('Guest login failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="glass" style={{ padding: '40px', width: '400px' }}>
        <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input type="text" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          <label>Email</label>
          <input type="email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          <label>Password</label>
          <input type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          <label>I am an</label>
          <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
            <option value="user">User</option>
            <option value="admin">Administrator</option>
          </select>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>Sign Up</button>
        </form>
        <button onClick={handleGuestLogin} className="glass" style={{ width: '100%', marginTop: '12px', padding: '10px', color: 'white' }}>Login as Guest</button>
        <p style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
