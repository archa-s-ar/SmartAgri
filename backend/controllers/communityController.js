const db = require('../db');

exports.getQueries = (req, res) => {
    const sql = `
        SELECT c.*, u.username 
        FROM community c 
        JOIN users u ON c.user_id = u.id 
        ORDER BY c.created_at DESC
    `;
    db.all(sql, [], (err, queries) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const repliesSql = `
            SELECT r.*, u.username 
            FROM query_replies r 
            JOIN users u ON r.user_id = u.id
            ORDER BY r.created_at ASC
        `;
        db.all(repliesSql, [], (err, allReplies) => {
            if (err) return res.status(500).json({ error: err.message });
            
            // Map replies to queries
            queries.forEach(q => {
                q.replies = allReplies.filter(r => r.query_id === q.id);
            });
            
            res.json(queries);
        });
    });
};

exports.createQuery = (req, res) => {
    const { title, query } = req.body;
    db.run(
        `INSERT INTO community (title, query, user_id) VALUES (?, ?, ?)`,
        [title, query, req.user.id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, message: "Query posted successfully" });
        }
    );
};

exports.addReply = (req, res) => {
    const { id } = req.params; // query_id
    const { reply } = req.body;
    db.run(
        `INSERT INTO query_replies (query_id, user_id, reply) VALUES (?, ?, ?)`,
        [id, req.user.id, reply],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, message: "Reply added successfully" });
        }
    );
};

exports.deleteQuery = (req, res) => {
    const { id } = req.params;
    db.get(`SELECT user_id FROM community WHERE id = ?`, [id], (err, row) => {
        if (!row || row.user_id !== req.user.id) return res.status(403).json({ error: "Unauthorized" });
        
        db.run(`DELETE FROM query_replies WHERE query_id = ?`, [id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            
            db.run(`DELETE FROM community WHERE id = ?`, [id], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: "Query deleted" });
            });
        });
    });
};
