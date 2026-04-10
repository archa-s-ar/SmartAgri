const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'agri-secret-key-123';

exports.register = async (req, res) => {
    const { username, password, phone } = req.body;

    if (!username || !password || !phone) {
        return res.status(400).json({ error: 'Username, password, and phone are required' });
    }

    try {
        const hash = await bcrypt.hash(password, 10);
        db.run(
            'INSERT INTO users (username, password, phone) VALUES (?, ?, ?)',
            [username, hash, phone],
            function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE')) {
                        return res.status(400).json({ error: 'Username already exists' });
                    }
                    return res.status(500).json({ error: err.message });
                }

                return res.json({ id: this.lastID, username, phone });
            }
        );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!user) return res.status(400).json({ error: 'User not found' });

            const match = await bcrypt.compare(password, user.password);
            if (!match) return res.status(401).json({ error: 'Invalid credentials' });

            const token = jwt.sign({ id: user.id }, SECRET);
            return res.json({
                token,
                user: { id: user.id, username: user.username, phone: user.phone }
            });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUserParams = async (req, res) => {
    db.get(
        'SELECT id, username, phone FROM users WHERE id = ?',
        [req.params.id],
        (err, user) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!user) return res.status(404).json({ error: 'User not found' });
            return res.json(user);
        }
    );
};

// Middleware to protect routes
exports.authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });
        req.user = decoded;
        next();
    });
};
