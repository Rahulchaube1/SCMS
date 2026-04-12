import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/RealTimeContext';
import { LogOut, PlusCircle, RefreshCw, MessageSquare } from 'lucide-react';
import Comments from '../components/Comments';

const UserDashboard = () => {
  const { user, token, logout } = useAuth();
  const socket = useSocket();
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', category: 'General', priority: 'Medium' });

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/complaints/user/${user.userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const stats = useMemo(() => ({
    total: complaints.length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
    active: complaints.filter(c => c.status !== 'Resolved').length
  }), [complaints]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('status_updated', (updatedC) => {
        setComplaints(prev => prev.map(c => c._id === updatedC._id ? { ...c, status: updatedC.status } : c));
      });
    }
    return () => {
      if (socket) socket.off('status_updated');
    };
  }, [socket]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/complaints', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowForm(false);
      fetchComplaints();
    } catch (err) {
      alert('Failed to submit complaint');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Service Portal</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user.name}</p>
        </div>
        <button onClick={logout} className="glass" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626', background: '#fee2e2' }}>
          <LogOut size={18} /> Logout
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div className="glass" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.total}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Tickets</div>
        </div>
        <div className="glass" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--resolved)' }}>{stats.resolved}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Resolved</div>
        </div>
        <div className="glass" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>{stats.active}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Ongoing</div>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' }} onClick={() => setShowForm(!showForm)}>
          <PlusCircle size={20} /> New Support Ticket
        </button>
      </div>

      {showForm && (
        <div className="glass" style={{ padding: '30px', marginBottom: '30px', background: 'white' }}>
          <h3>Submit New Request</h3>
          <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Issue Title</label>
                <input type="text" onChange={(e) => setFormData({...formData, title: e.target.value})} required placeholder="Short summary" />
              </div>
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Priority Level</label>
                <select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
            
            <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Category</label>
            <select onChange={(e) => setFormData({...formData, category: e.target.value})}>
              <option>General</option>
              <option>Technical</option>
              <option>Billing</option>
              <option>Other</option>
            </select>
            
            <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Detailed Description</label>
            <textarea onChange={(e) => setFormData({...formData, description: e.target.value})} style={{ minHeight: '120px' }} required placeholder="Explain your issue in detail..." />
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" className="btn-primary">Submit Ticket</button>
              <button type="button" onClick={() => setShowForm(false)} className="glass" style={{ padding: '10px 20px' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
        {complaints.map(c => (
          <div key={c._id} className="glass" style={{ padding: '25px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <span className={`badge ${c.status.toLowerCase().replace(' ', '-')}`}>{c.status}</span>
              <span className={`badge p-${c.priority.toLowerCase()}`} style={{ fontSize: '0.7rem' }}>{c.priority}</span>
            </div>
            <h4 style={{ marginBottom: '10px', fontSize: '1.1rem' }}>{c.title}</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '15px', lineHeight: '1.5' }}>{c.description}</p>
            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}># {c.category}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{new Date(c.createdAt).toLocaleDateString()}</span>
            </div>
            <Comments complaintId={c._id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
