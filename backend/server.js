const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const authRoutes = require('./routes/authRoutes');
const marketRoutes = require('./routes/marketRoutes');
const cropRoutes = require('./routes/cropRoutes');
const schemeRoutes = require('./routes/schemeRoutes');
const communityRoutes = require('./routes/communityRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const frontendUrl = process.env.FRONTEND_URL;

app.use(cors({
    origin: frontendUrl ? frontendUrl.split(',').map((url) => url.trim()) : true,
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/recommend-crop', cropRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/community', communityRoutes);

app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
});

app.get('/api/weather-advice', (req, res) => {
    const { weather } = req.query;
    let advice = "Maintain regular watering and monitor for pests.";
    if (weather === 'Rainy') {
        advice = "Ensure proper drainage to prevent root rot. Avoid fertilizer application right before heavy rain.";
    } else if (weather === 'Sunny') {
        advice = "Increase irrigation frequency. Consider shade nets for sensitive crops.";
    } else if (weather === 'Cold') {
        advice = "Protect sensitive crops from frost. Reduce watering frequency.";
    }
    
    res.json({ advice });
});

const frontendDistPath = path.resolve(__dirname, '../frontend/dist');
app.use(express.static(frontendDistPath));

app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
        return next();
    }

    return res.sendFile(path.join(frontendDistPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
