import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/RealTimeContext';
import { LogOut, Filter, Search, BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Comments from '../components/Comments';

const AdminDashboard = () => {
  const { token, logout } = useAuth();
  const socket = useSocket();
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);

  const fetchAllComplaints = useCallback(async () => {
    try {
      const url = `http://localhost:5000/api/complaints?status=${filter}&search=${search}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [filter, search, token]);

  useEffect(() => {
    fetchAllComplaints();
  }, [fetchAllComplaints]);

  useEffect(() => {
    if (socket) {
      socket.on('new_complaint', (newC) => {
        setComplaints(prev => [newC, ...prev]);
      });
      socket.on('complaint_updated', (updatedC) => {
        setComplaints(prev => prev.map(c => c._id === updatedC._id ? { ...c, ...updatedC } : c));
      });
    }
    return () => {
      if (socket) {
        socket.off('new_complaint');
        socket.off('complaint_updated');
      }
    };
  }, [socket]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/complaints/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch {
      alert('Failed to update status');
    }
  };

  const updatePriority = async (id, priority) => {
    try {
      await axios.put(`http://localhost:5000/api/complaints/${id}`, { priority }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch {
      alert('Failed to update priority');
    }
  };

  const exportToCSV = () => {
    const headers = ['Order ID', 'Title', 'User', 'Email', 'Category', 'Status', 'Priority', 'Date'];
    const rows = complaints.map(c => [
      c._id,
      c.title,
      c.userId?.name || 'Guest',
      c.userId?.email || 'N/A',
      c.category,
      c.status,
      c.priority,
      new Date(c.createdAt).toLocaleDateString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers, ...rows].map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `complaints_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const COLORS = ['#d97706', '#2563eb', '#059669'];
  const analyticsData = useMemo(() => ([
    { name: 'Pending', value: complaints.filter((c) => c.status === 'Pending').length },
    { name: 'In Progress', value: complaints.filter((c) => c.status === 'In Progress').length },
    { name: 'Resolved', value: complaints.filter((c) => c.status === 'Resolved').length },
  ]), [complaints]);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img src="/logo.png" alt="Logo" style={{ width: '60px', height: '60px', borderRadius: '12px' }} />
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>Admin Command</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Operation Intelligence Dashboard</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button className="btn-primary" onClick={exportToCSV} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0f172a' }}>
            <Search size={18} /> Export CSV
          </button>
          <button className="glass" onClick={() => setShowAnalytics(!showAnalytics)} style={{ padding: '8px 16px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px', background: 'white' }}>
            {showAnalytics ? <Filter size={18} /> : <BarChart3 size={18} />}
            {showAnalytics ? 'View Tickets' : 'Analytics'}
          </button>
          <button onClick={logout} className="glass" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626', background: '#fee2e2' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      {!showAnalytics ? (
        <>
          <div className="glass" style={{ padding: '25px', marginBottom: '30px', display: 'flex', gap: '20px', flexWrap: 'wrap', background: 'white' }}>
            <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-secondary)' }} size={18} />
              <input 
                type="text" 
                placeholder="Search ticket database..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '40px', marginBottom: 0, background: '#f8fafc' }} 
              />
            </div>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ marginBottom: 0, width: '200px', background: '#f8fafc' }}>
              <option value="">Filter by Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '25px' }}>
            {complaints.map(c => (
              <div key={c._id} className="glass" style={{ padding: '25px', background: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <span className={`badge ${c.status.toLowerCase().replace(' ', '-')}`}>{c.status}</span>
                    <span className={`badge p-${c.priority.toLowerCase()}`}>{c.priority}</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
                
                <h3 style={{ marginBottom: '10px' }}>{c.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '15px' }}>{c.description}</p>
                
                <div style={{ fontSize: '0.85rem', marginBottom: '20px', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  <div style={{ fontWeight: 600 }}>{c.userId?.name || 'Guest Session'}</div>
                  <div style={{ color: 'var(--text-secondary)' }}>{c.userId?.email || 'N/A'}</div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Update Status</label>
                    <select value={c.status} onChange={(e) => updateStatus(c._id, e.target.value)} style={{ marginBottom: 0, padding: '8px', fontSize: '0.85rem' }}>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Update Priority</label>
                    <select value={c.priority} onChange={(e) => updatePriority(c._id, e.target.value)} style={{ marginBottom: 0, padding: '8px', fontSize: '0.85rem' }}>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <Comments complaintId={c._id} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="glass" style={{ padding: '50px', height: '600px', background: 'white' }}>
          <h3 style={{ marginBottom: '30px' }}>System Health & Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={analyticsData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={150}
                paddingAngle={8}
                dataKey="value"
              >
                {analyticsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                itemStyle={{ color: 'var(--text-main)' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
