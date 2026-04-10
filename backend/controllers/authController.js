const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = 'agri-secret-key-123';

exports.register = (req, res) => {
    const { username, password, phone } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json({ error: err.message });
        
        db.run(`INSERT INTO users (username, password, phone) VALUES (?, ?, ?)`, 
        [username, hash, phone], function(err) {
            if (err) return res.status(400).json({ error: "Username already exists" });
            res.json({ id: this.lastID, username, phone });
        });
    });
};

exports.login = (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err || !user) return res.status(400).json({ error: "User not found" });
        
        bcrypt.compare(password, user.password, (err, match) => {
            if (!match) return res.status(401).json({ error: "Invalid credentials" });
            const token = jwt.sign({ id: user.id }, SECRET);
            res.json({ token, user: { id: user.id, username: user.username, phone: user.phone } });
        });
    });
};

exports.getUserParams = (req, res) => {
    db.get(`SELECT id, username, phone FROM users WHERE id = ?`, [req.params.id], (err, user) => {
        if (err || !user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    });
};

// Middleware to protect routes
exports.authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Invalid token" });
        req.user = decoded;
        next();
    });
};
