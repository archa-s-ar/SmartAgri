import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Users, MessageCircle, Send, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

function CommunityPage({ user }) {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newQuery, setNewQuery] = useState({ title: '', query: '' });
    const [replyText, setReplyText] = useState({});

    const loadQueries = async () => {
        try {
            const res = await apiService.getQueries();
            setQueries(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadQueries();
    }, []);

    const handlePostQuery = async (e) => {
        e.preventDefault();
        try {
            await apiService.createQuery(newQuery);
            setNewQuery({ title: '', query: '' });
            loadQueries();
        } catch (err) {
            alert("Error posting query. Please make sure you are logged in.");
        }
    };

    const handleReply = async (queryId) => {
        const text = replyText[queryId];
        if (!text) return;

        try {
            await apiService.addReply(queryId, text);
            setReplyText({ ...replyText, [queryId]: '' });
            loadQueries();
        } catch (err) {
            alert("Error adding reply. Please login first.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this post?")) return;
        try {
            await apiService.deleteQuery(id);
            loadQueries();
        } catch (err) {
            alert("Failed to delete. You can only delete your own posts.");
        }
    };

    return (
        <div>
            <h1 className="page-title"><Users size={32} /> Farmer Community</h1>
            <p className="page-subtitle">Ask questions, share experiences, and connect with other farmers</p>

            <div className="split-layout">
                <div style={{ flex: 1 }}>
                    <div className="card">
                        <h3>Ask the Community</h3>
                        {!user ? (
                            <div style={{ textAlign: 'center', padding: '1rem' }}>
                                <p>Please login to post a question.</p>
                                <Link to="/login" className="btn btn-primary" style={{ marginTop: '1rem' }}>Login</Link>
                            </div>
                        ) : (
                            <form onSubmit={handlePostQuery}>
                                <div className="form-group">
                                    <label>Question Title</label>
                                    <input 
                                        type="text" 
                                        required 
                                        placeholder="e.g., Which fertilizer for wheat?"
                                        value={newQuery.title}
                                        onChange={e => setNewQuery({...newQuery, title: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Details</label>
                                    <textarea 
                                        required
                                        rows="4"
                                        placeholder="Explain your situation in detail..."
                                        value={newQuery.query}
                                        onChange={e => setNewQuery({...newQuery, query: e.target.value})}
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                                    <Send size={18} /> Post Question
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                <div style={{ flex: 2 }}>
                    {loading ? (
                        <div className="loading">Loading community posts...</div>
                    ) : queries.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center' }}>No queries found. Be the first to ask!</div>
                    ) : (
                        queries.map(q => (
                            <div className="card" key={q.id} style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h3 style={{ border: 'none', marginBottom: '0.2rem' }}>{q.title}</h3>
                                        <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                                            Posted by <strong>{q.username}</strong> on {new Date(q.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    {user && user.id === q.user_id && (
                                        <button onClick={() => handleDelete(q.id)} className="btn btn-danger" title="Delete Post">
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                                
                                <p style={{ backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '4px', borderLeft: '3px solid var(--primary)' }}>
                                    {q.query}
                                </p>

                                <div style={{ marginTop: '1.5rem', paddingLeft: '1.5rem', borderLeft: '2px solid #ddd' }}>
                                    <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <MessageCircle size={18} /> Replies ({q.replies?.length || 0})
                                    </h4>
                                    
                                    {q.replies && q.replies.map(r => (
                                        <div key={r.id} style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>
                                            <p><strong>{r.username}</strong> <span style={{ color: '#888', fontSize: '0.8rem' }}>{new Date(r.created_at).toLocaleDateString()}</span></p>
                                            <p>{r.reply}</p>
                                        </div>
                                    ))}

                                    {user && (
                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                            <input 
                                                type="text" 
                                                placeholder="Add a reply..." 
                                                value={replyText[q.id] || ''}
                                                onChange={e => setReplyText({...replyText, [q.id]: e.target.value})}
                                            />
                                            <button onClick={() => handleReply(q.id)} className="btn btn-secondary">Reply</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default CommunityPage;
