import React, { useState } from 'react';
import { apiService } from '../services/api';
import { Sprout, Droplets, Sun, MapPin, Search } from 'lucide-react';

function AdvisorPage() {
    const [formData, setFormData] = useState({
        location: '',
        soilType: 'Loamy',
        season: 'Monsoon',
        weather: 'Sunny'
    });
    
    const [results, setResults] = useState(null);
    const [advice, setAdvice] = useState('');
    const [loading, setLoading] = useState(false);

    const useCurrentLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                // Mock reverse geocoding to keep it simple without API keys
                setFormData({
                    ...formData,
                    location: `${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`,
                    soilType: 'Alluvial' // Mock automatic soil type
                });
            }, error => {
                alert("Error getting location: " + error.message);
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await apiService.getRecommendations(formData);
            const wAdvice = await apiService.getWeatherAdvice(formData.weather);
            setResults(res.data);
            setAdvice(wAdvice.data.advice);
        } catch (error) {
            console.error(error);
            alert('Failed to get recommendations.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="page-title"><Sprout size={32} /> Smart Crop Advisor</h1>
            <p className="page-subtitle">Get personalized crop recommendations and farming tips</p>

            <div className="split-layout">
                <div style={{ flex: 1 }}>
                    <div className="card">
                        <h3>Farm Details</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label><MapPin size={18} /> Location</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input 
                                        type="text" 
                                        value={formData.location}
                                        onChange={e => setFormData({...formData, location: e.target.value})}
                                        placeholder="Enter location or use GPS"
                                    />
                                    <button type="button" onClick={useCurrentLocation} className="btn btn-secondary">Use GPS</button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label><Droplets size={18} /> Soil Type</label>
                                <select 
                                    value={formData.soilType}
                                    onChange={e => setFormData({...formData, soilType: e.target.value})}
                                >
                                    <option>Loamy</option>
                                    <option>Clay</option>
                                    <option>Sandy</option>
                                    <option>Black</option>
                                    <option>Alluvial</option>
                                    <option>Red</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label><Sun size={18} /> Season</label>
                                <select 
                                    value={formData.season}
                                    onChange={e => setFormData({...formData, season: e.target.value})}
                                >
                                    <option>Monsoon</option>
                                    <option>Winter</option>
                                    <option>Summer</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Current Weather</label>
                                <select 
                                    value={formData.weather}
                                    onChange={e => setFormData({...formData, weather: e.target.value})}
                                >
                                    <option>Sunny</option>
                                    <option>Rainy</option>
                                    <option>Cold</option>
                                    <option>Cloudy</option>
                                </select>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                                <Search size={20} /> Get Recommendations
                            </button>
                        </form>
                    </div>
                </div>

                <div style={{ flex: 1.5 }}>
                    {loading ? (
                        <div className="loading">Analyzing data to find the best crops for you...</div>
                    ) : results ? (
                        <div>
                            <div className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--secondary)' }}>
                                <h3>💡 Farming Tips based on {formData.weather} weather</h3>
                                <p><strong>General Advice:</strong> {results.tips}</p>
                                <p><strong>Weather Action:</strong> {advice}</p>
                            </div>

                            <h3>Recommended Crops</h3>
                            <div className="card-grid">
                                {results.recommendedCrops.map((crop, index) => (
                                    <div className="card" key={index}>
                                        <h3>{crop.name}</h3>
                                        <div className="card-content">
                                            <p><span className="tag">Ideal Soil</span> {crop.soil}</p>
                                            <p><span className="tag">Season</span> {crop.season}</p>
                                            <p><strong>Top Hybrid:</strong> {crop.hybrid}</p>
                                            <p><strong>Est. Time to Harvest:</strong> {crop.timeToHarvest}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', color: '#666' }}>
                            <Sprout size={64} style={{ color: '#ccc', marginBottom: '1rem' }} />
                            <h2>Ready to Advise</h2>
                            <p>Fill out the form on the left to get personalized crop recommendations based on your unique farming conditions.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdvisorPage;
