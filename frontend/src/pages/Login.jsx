import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(res.data);
      navigate('/');
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.message || 'Error'));
    }
  };

  const handleGuestLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/guest-login');
      login(res.data);
      navigate('/');
    } catch (err) {
      alert('Guest login failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="glass" style={{ padding: '40px', width: '400px', textAlign: 'center' }}>
        <img src="/logo.png" alt="Nano Banana Logo" style={{ width: '80px', marginBottom: '20px', borderRadius: '12px' }} />
        <h2 style={{ marginBottom: '24px' }}>Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>Sign In</button>
        </form>
        <button onClick={handleGuestLogin} className="glass" style={{ width: '100%', marginTop: '12px', padding: '10px', color: 'white' }}>Login as Guest</button>
        <p style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)' }}>Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
