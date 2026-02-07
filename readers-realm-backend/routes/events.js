const express = require("express");
const db = require("../db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded user info to request
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ error: "Invalid token" });
    }
};

// Get all events
router.get("/", async (req, res) => {
    try {
        const [events] = await db.query("SELECT * FROM Events ORDER BY event_date ASC");
        res.json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Get a single event by ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [event] = await db.query("SELECT * FROM Events WHERE event_id = ?", [id]);
        if (event.length === 0) {
            return res.status(404).json({ error: "Event not found" });
        }
        res.json(event[0]);
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Create a new event (Requires authentication)
router.post("/", verifyToken, async (req, res) => {
    const { title, description, event_date, location } = req.body;

    if (!title || !event_date) {
        return res.status(400).json({ error: "Title and event date are required" });
    }

    try {
        const query = "INSERT INTO Events (title, description, event_date, location) VALUES (?, ?, ?, ?)";
        await db.query(query, [title, description, event_date, location]);

        res.status(201).json({ message: "Event created successfully" });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
