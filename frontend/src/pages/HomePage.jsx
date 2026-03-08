import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShoppingCart, Users, Info, ArrowRight, Sun, Droplets } from 'lucide-react';

function HomePage() {
    return (
        <div>
            {/* Hero Section */}
            <div style={{ 
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)', 
                color: 'white', 
                padding: '4rem 2rem', 
                borderRadius: '12px',
                textAlign: 'center',
                marginBottom: '3rem',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
            }}>
                <Sprout size={64} style={{ marginBottom: '1rem' }} />
                <h1 style={{ color: 'white', fontSize: '3rem', marginBottom: '1rem' }}>Empowering Farmers Every Step of the Way</h1>
                <p style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto 2rem', opacity: 0.9 }}>
                    Smart Agri Intelligence & Supply Chain is your one-stop platform for AI-driven crop advice, direct market access, and community support. Let's grow together.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    <Link to="/advisor" className="btn" style={{ backgroundColor: 'white', color: 'var(--primary)' }}>
                        Get Crop Advice <ArrowRight size={18} />
                    </Link>
                    <Link to="/market" className="btn btn-secondary" style={{ border: '2px solid transparent' }}>
                        Visit Market Place
                    </Link>
                </div>
            </div>

            {/* Features Level 1 */}
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Our Core Services</h2>
            <div className="card-grid">
                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ background: '#e8f5e9', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--primary)' }}>
                        <Sun size={32} />
                    </div>
                    <h3>Smart Advisory</h3>
                    <p style={{ color: '#666' }}>Get real-time crop recommendations tailored to your soil type, season, and current weather conditions.</p>
                </div>

                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ background: '#fff3e0', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#f57c00' }}>
                        <ShoppingCart size={32} />
                    </div>
                    <h3>Direct Connect Market</h3>
                    <p style={{ color: '#666' }}>Eliminate middlemen. List your harvest directly and connect with buyers to get the best expected price.</p>
                </div>

                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ background: '#e3f2fd', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#1976d2' }}>
                        <Users size={32} />
                    </div>
                    <h3>Farmer Community</h3>
                    <p style={{ color: '#666' }}>A dedicated forum to ask questions, share agricultural experiences, and learn from experts and peers.</p>
                </div>

                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ background: '#fce4ec', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#c2185b' }}>
                        <Info size={32} />
                    </div>
                    <h3>Govt Schemes</h3>
                    <p style={{ color: '#666' }}>Stay updated with the latest government subsidies, insurance schemes (PMFBY), and credit card info (KCC).</p>
                </div>
            </div>

            {/* Tech impact section */}
            <div className="card" style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', padding: '3rem' }}>
                <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '2rem' }}>Data-Driven Agriculture</h2>
                    <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '1rem', lineHeight: 1.6 }}>
                        By leveraging environmental metrics like <strong style={{color: 'var(--primary)'}}><Droplets size={16}/> Soil Composition</strong> and <strong style={{color: '#f57c00'}}><Sun size={16}/> Weather Forecasts</strong>, we help mitigate risks before they happen.
                    </p>
                    <p style={{ fontSize: '1.1rem', color: '#555', lineHeight: 1.6 }}>
                        Whether you are growing cash crops or food staples, our platform guides you to maximize yield and profitability while acting sustainably.
                    </p>
                </div>
                <div style={{ flex: 1, backgroundColor: '#f5f5f5', borderRadius: '8px', padding: '2rem', textAlign: 'center' }}>
                    <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Farmer with tech" style={{ maxWidth: '100%', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                </div>
            </div>
        </div>
    );
}

export default HomePage;
