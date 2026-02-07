const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware to verify token (directly in this file)
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

// GET reviews for a specific book
router.get("/:book_id", async (req, res) => {
    try {
        const { book_id } = req.params;
        const [reviews] = await db.execute(
            "SELECT Reviews.review_id, Reviews.rating, Reviews.review_text, Reviews.created_at, Users.username FROM Reviews JOIN Users ON Reviews.user_id = Users.user_id WHERE Reviews.book_id = ?",
            [book_id]
        );

        res.json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: "Error retrieving reviews", error });
    }
});

// POST a new review (Protected Route)
router.post("/", verifyToken, async (req, res) => {
    try {
        const { book_id, rating, review_text } = req.body;
        const user_id = req.user.id; // Get user_id from verified token

        if (!book_id || !user_id || !rating || !review_text) {
            return res.status(400).json({ message: "All fields are required" });
        }

        await db.execute(
            "INSERT INTO Reviews (book_id, user_id, rating, review_text) VALUES (?, ?, ?, ?)",
            [book_id, user_id, rating, review_text]
        );

        res.status(201).json({ message: "Review added successfully!" });
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ message: "Error submitting review", error });
    }
});

module.exports = router;
