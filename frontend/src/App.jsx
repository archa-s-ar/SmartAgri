import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Sprout, ShoppingCart, Info, Users, LogOut, Home } from 'lucide-react';
import { authService } from './services/api';

import HomePage from './pages/HomePage';
import AdvisorPage from './pages/AdvisorPage';
import MarketPage from './pages/MarketPage';
import SchemesPage from './pages/SchemesPage';
import CommunityPage from './pages/CommunityPage';
import AuthPage from './pages/AuthPage';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" className="logo">
          <Sprout size={28} />
          <span>SmartAgri</span>
        </Link>
        <div className="nav-links">
          <Link to="/"><Home size={20} /> Home</Link>
          <Link to="/advisor"><Sprout size={20} /> Advisor</Link>
          <Link to="/market"><ShoppingCart size={20} /> Market</Link>
          <Link to="/schemes"><Info size={20} /> Schemes</Link>
          <Link to="/community"><Users size={20} /> Community</Link>
          {user ? (
            <button onClick={handleLogout} className="btn btn-outline" style={{ color: 'white', borderColor: 'white' }}>
              <LogOut size={20} /> Logout
            </button>
          ) : (
            <Link to="/login" className="btn btn-primary">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  const [user, setUser] = React.useState(authService.getCurrentUser());

  return (
    <Router>
      <div className="app-container">
        <Navbar user={user} onLogout={() => setUser(null)} />
        <div className="container" style={{ marginTop: '2rem' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/advisor" element={<AdvisorPage />} />
            <Route path="/market" element={<MarketPage user={user} />} />
            <Route path="/schemes" element={<SchemesPage />} />
            <Route path="/community" element={<CommunityPage user={user} />} />
            <Route path="/login" element={<AuthPage onLogin={setUser} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
