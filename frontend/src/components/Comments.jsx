import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/RealTimeContext';
import { Send, MessageSquare } from 'lucide-react';

const Comments = ({ complaintId }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const { token } = useAuth();
  const socket = useSocket();

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/complaints/${complaintId}/comments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComments();

    if (socket) {
      socket.on('new_comment', (data) => {
        if (data.complaintId === complaintId) {
          setComments(prev => [...prev, data.comment]);
        }
      });
    }

    return () => {
      if (socket) socket.off('new_comment');
    };
  }, [complaintId, socket]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await axios.post(`http://localhost:5000/api/complaints/${complaintId}/comments`, { text }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setText('');
    } catch (err) {
      alert('Failed to post comment');
    }
  };

  return (
    <div style={{ marginTop: '20px', borderTop: '1px solid var(--glass-border)', paddingTop: '15px' }}>
      <h5 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px', color: 'var(--text-secondary)' }}>
        <MessageSquare size={16} /> Discussions
      </h5>
      
      <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '15px' }}>
        {comments.map((c, i) => (
          <div key={i} style={{ marginBottom: '10px', fontSize: '0.85rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{c.author?.name}: </span>
            <span style={{ color: 'var(--text-main)' }}>{c.text}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Type a message..." 
          value={text} 
          onChange={(e) => setText(e.target.value)}
          style={{ marginBottom: 0, padding: '8px' }}
        />
        <button type="submit" className="btn-primary" style={{ padding: '8px 12px' }}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default Comments;
