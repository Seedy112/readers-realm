const express = require("express");
const router = express.Router();
const db = require("../db");

// POST /api/contact - Receive contact form data
router.post("/", (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const query = `
        INSERT INTO ContactMessages (name, email, message)
        VALUES (?, ?, ?)
    `;

    db.query(query, [name, email, message], (err, result) => {
        if (err) {
            console.error("Error inserting contact message:", err);
            return res.status(500).json({ error: "Internal server error." });
        }

        res.json({ success: true, message: "Message sent successfully!" });
    });
});

module.exports = router;
