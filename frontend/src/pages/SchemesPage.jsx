import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Info, ExternalLink, ShieldCheck } from 'lucide-react';

function SchemesPage() {
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchemes = async () => {
            try {
                const res = await apiService.getSchemes();
                setSchemes(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchSchemes();
    }, []);

    return (
        <div>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 className="page-title"><Info size={32} /> Government Agricultural Schemes</h1>
                <p className="page-subtitle">Available financial and technical support programs from the Government</p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#e3f2fd', color: '#1565c0', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem' }}>
                    <ShieldCheck size={18} /> Verified official information
                </div>
            </div>

            {loading ? (
                <div className="loading">Loading schemes information...</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
                    {schemes.map(s => (
                        <div className="card" key={s.id} style={{ borderLeft: '5px solid var(--primary)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{ margin: 0 }}>{s.title}</h2>
                                <a href={s.link} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ padding: '0.4rem 0.8rem' }}>
                                    Visit Official Portal <ExternalLink size={16} />
                                </a>
                            </div>
                            
                            <p style={{ marginTop: '1rem', fontSize: '1.1rem', color: '#444', lineHeight: 1.6 }}>
                                {s.description}
                            </p>
                            
                            <div style={{ marginTop: '1.5rem', backgroundColor: '#f1f8e9', padding: '1rem', borderRadius: '6px' }}>
                                <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Key Benefits</h4>
                                <ul style={{ listStyleType: 'none', padding: 0 }}>
                                    {s.benefits.map((b, idx) => (
                                        <li key={idx} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                                            <span style={{ color: 'var(--primary)' }}>✓</span> {b}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <div className="card" style={{ marginTop: '3rem', textAlign: 'center', background: '#fff9c4' }}>
                <h3>Need help applying?</h3>
                <p>Post a question on our <a href="/community" style={{ color: '#d84315', fontWeight: 'bold' }}>Farmer Community</a> page. Other farmers who have successfully applied can guide you through the process.</p>
            </div>
        </div>
    );
}

export default SchemesPage;
