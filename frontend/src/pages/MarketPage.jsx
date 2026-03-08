import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { ShoppingCart, Plus, Edit2, Trash2, Phone, X } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function MarketPage({ user }) {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    
    // For creating and editing
    const [formData, setFormData] = useState({ id: null, crop_name: '', quantity: '', price: '', description: '' });
    const [isEditing, setIsEditing] = useState(false);

    // Contact info modal
    const [selectedSeller, setSelectedSeller] = useState(null);

    const loadListings = async () => {
        try {
            const res = await apiService.getMarket();
            setListings(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadListings();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await apiService.updateListing(formData.id, formData);
            } else {
                await apiService.createListing(formData);
            }
            setShowForm(false);
            setFormData({ id: null, crop_name: '', quantity: '', price: '', description: '' });
            setIsEditing(false);
            loadListings();
        } catch (err) {
            alert('Error saving listing. Make sure you are logged in.');
        }
    };

    const handleEdit = (listing) => {
        setFormData({
            id: listing.id,
            crop_name: listing.crop_name,
            quantity: listing.quantity,
            price: listing.price,
            description: listing.description
        });
        setIsEditing(true);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this listing?")) return;
        try {
            await apiService.deleteListing(id);
            loadListings();
        } catch (err) {
            alert("Delete failed. You can only delete your own listings.");
        }
    };

    // Prepare chart data (simple mock aggregation)
    const cropPrices = listings.reduce((acc, curr) => {
        if (!acc[curr.crop_name]) {
            acc[curr.crop_name] = { total: 0, count: 0 };
        }
        acc[curr.crop_name].total += curr.price;
        acc[curr.crop_name].count += 1;
        return acc;
    }, {});

    const chartData = {
        labels: Object.keys(cropPrices),
        datasets: [
            {
                label: 'Average Expected Price (₹)',
                data: Object.keys(cropPrices).map(key => cropPrices[key].total / cropPrices[key].count),
                backgroundColor: 'rgba(96, 173, 94, 0.7)',
                borderColor: 'rgba(46, 125, 50, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}><ShoppingCart size={32} /> Market Connect</h1>
                    <p style={{ color: '#666', marginTop: '0.5rem' }}>Direct farmer-to-buyer platform. Eliminating middlemen.</p>
                </div>
                {user && (
                    <button onClick={() => { setShowForm(!showForm); setIsEditing(false); setFormData({ id: null, crop_name: '', quantity: '', price: '', description: ''}); }} className="btn btn-primary">
                        {showForm ? 'Cancel' : <><Plus size={20} /> New Listing</>}
                    </button>
                )}
            </div>

            {showForm && (
                <div className="card" style={{ marginBottom: '2rem', border: '2px solid var(--primary)' }}>
                    <h3>{isEditing ? 'Edit Listing' : 'Create New Listing'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Crop Name</label>
                            <input type="text" required value={formData.crop_name} onChange={e => setFormData({...formData, crop_name: e.target.value})} />
                        </div>
                        <div className="split-layout">
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Quantity (with unit, e.g., '100 kg')</label>
                                <input type="text" required value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Expected Price (Total in ₹)</label>
                                <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Description (Quality, harvest date, location, etc.)</label>
                            <textarea rows="3" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">{isEditing ? 'Update Listing' : 'Post Listing'}</button>
                    </form>
                </div>
            )}

            {Object.keys(cropPrices).length > 0 && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3>Market Trends Overview</h3>
                    <div style={{ height: '300px' }}>
                        <Bar 
                            data={chartData} 
                            options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} 
                        />
                    </div>
                </div>
            )}

            <h3>Available Crops from Farmers</h3>
            {loading ? (
                <div className="loading">Loading market listings...</div>
            ) : listings.length === 0 ? (
                <p>No listings currently available.</p>
            ) : (
                <div className="card-grid">
                    {listings.map(l => (
                        <div className="card" key={l.id}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <h3 style={{ fontSize: '1.4rem' }}>{l.crop_name}</h3>
                                <div style={{ background: '#e8f5e9', padding: '0.3rem 0.6rem', borderRadius: '4px', fontWeight: 'bold', color: 'var(--primary)' }}>
                                    ₹{l.price}
                                </div>
                            </div>
                            
                            <div className="card-content">
                                <p><span className="tag">Quantity</span> {l.quantity}</p>
                                <p><span className="tag">Seller</span> {l.username}</p>
                                <p style={{ marginTop: '1rem', color: '#555', minHeight: '60px' }}>"{l.description}"</p>
                            </div>

                            <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setSelectedSeller(l)}>
                                    <Phone size={16} /> Contact Seller
                                </button>
                                
                                {user && user.id === l.user_id && (
                                    <>
                                        <button className="btn btn-outline" onClick={() => handleEdit(l)} title="Edit">
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="btn btn-danger" onClick={() => handleDelete(l.id)} title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Contact Seller Modal */}
            {selectedSeller && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ width: '400px', maxWidth: '90%', position: 'relative' }}>
                        <button 
                            onClick={() => setSelectedSeller(null)}
                            style={{ position: 'absolute', right: '1rem', top: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <X size={24} color="#666" />
                        </button>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                            <Phone size={24} /> Seller Contact Info
                        </h2>
                        
                        <div style={{ backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}><strong>Seller Name:</strong> {selectedSeller.username}</p>
                            <p style={{ fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                                <Phone size={18} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> 
                                {selectedSeller.phone || "Not provided"}
                            </p>
                        </div>
                        
                        <p style={{ color: '#666', fontSize: '0.9rem', textAlign: 'center' }}>
                            Please mention you found this listing on the Smart Agri platform when contacting the seller regarding their {selectedSeller.crop_name} listing.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MarketPage;
