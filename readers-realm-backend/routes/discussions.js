const express = require("express");
const router = express.Router();
const pool = require("../db");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Ensure environment variables are loaded

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

// GET all discussions
router.get("/", async (req, res) => {
    try {
        const [discussions] = await pool.query(  // <-- Destructure to get only data
            "SELECT d.discussion_id, d.title, d.content, d.created_at, u.username FROM Discussions d JOIN Users u ON d.user_id = u.user_id ORDER BY d.created_at DESC"
        );

        //console.log("Returning discussions:", discussions); // Debugging log
        res.json(discussions);
    } catch (error) {
        console.error("Error fetching discussions:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// POST a new discussion (Requires authentication)
router.post("/", verifyToken, async (req, res) => {
    const { title, content } = req.body;
    const user_id = req.user.id; // Retrieved from token

    if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required" });
    }

    try {
        // Insert the new discussion
        const insertResult = await pool.query(
            "INSERT INTO Discussions (user_id, title, content) VALUES (?, ?, ?)",
            [user_id, title, content]
        );

        // Fetch the newly inserted discussion using LAST_INSERT_ID()
        const discussion_id = insertResult[0].insertId;

        const result = await pool.query(
            "SELECT discussion_id, title, content, created_at FROM Discussions WHERE discussion_id = ?",
            [discussion_id]
        );

        if (result[0].length === 0) {
            return res.status(404).json({ message: "Discussion not found after insertion" });
        }

        res.status(201).json(result[0][0]);
    } catch (error) {
        console.error("Error posting discussion:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});


// GET comments for a specific discussion
router.get("/:discussion_id/comments", async (req, res) => {
    const { discussion_id } = req.params;

    try {
        const [comments] = await pool.query( 
            "SELECT c.comment_id, c.content, c.created_at, u.username FROM DiscussionComments c JOIN Users u ON c.user_id = u.user_id WHERE c.discussion_id = ? ORDER BY c.created_at ASC",
            [discussion_id]
        );

        res.json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// POST a new comment (Requires authentication)
router.post("/:discussion_id/comments", verifyToken, async (req, res) => {
    const { discussion_id } = req.params;
    const { content } = req.body;
    const user_id = req.user.id; // Retrieved from token

    if (!content) {
        return res.status(400).json({ message: "Content is required" });
    }

    try {
        // Insert the new comment
        await pool.query(
            "INSERT INTO DiscussionComments (discussion_id, user_id, content) VALUES (?, ?, ?)",
            [discussion_id, user_id, content]
        );

        // Fetch the newly inserted comment
        const [result] = await pool.query(
            "SELECT comment_id, content, created_at FROM DiscussionComments WHERE discussion_id = ? AND user_id = ? ORDER BY created_at DESC LIMIT 1",
            [discussion_id, user_id]
        );

        res.status(201).json(result[0]); // Send the first object from the array
    } catch (error) {
        console.error("Error posting comment:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



module.exports = router;
