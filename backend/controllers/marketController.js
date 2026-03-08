const db = require('../db');

exports.getMarketListings = (req, res) => {
    const query = `
        SELECT m.*, u.username, u.phone 
        FROM market m 
        JOIN users u ON m.user_id = u.id
        ORDER BY m.id DESC
    `;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

exports.createListing = (req, res) => {
    const { crop_name, quantity, price, description } = req.body;
    db.run(
        `INSERT INTO market (crop_name, quantity, price, description, user_id) VALUES (?, ?, ?, ?, ?)`,
        [crop_name, quantity, price, description, req.user.id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, message: "Listing created successfully" });
        }
    );
};

exports.updateListing = (req, res) => {
    const { id } = req.params;
    const { crop_name, quantity, price, description } = req.body;
    
    // Check ownership
    db.get(`SELECT user_id FROM market WHERE id = ?`, [id], (err, row) => {
        if (!row || row.user_id !== req.user.id) return res.status(403).json({ error: "Unauthorized" });
        
        db.run(
            `UPDATE market SET crop_name=?, quantity=?, price=?, description=? WHERE id=?`,
            [crop_name, quantity, price, description, id],
            (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: "Listing updated" });
            }
        );
    });
};

exports.deleteListing = (req, res) => {
    const { id } = req.params;
    db.get(`SELECT user_id FROM market WHERE id = ?`, [id], (err, row) => {
        if (!row || row.user_id !== req.user.id) return res.status(403).json({ error: "Unauthorized" });
        
        db.run(`DELETE FROM market WHERE id=?`, [id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Listing deleted" });
        });
    });
};
