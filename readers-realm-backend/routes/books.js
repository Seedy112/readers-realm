const express = require("express");
const router = express.Router();
const db = require("../db"); // Database connection

// GET all books
router.get("/", async (req, res) => {
    try {
        const [books] = await db.query("SELECT * FROM Books"); // Ensure correct destructuring
        if (!Array.isArray(books)) {
            throw new Error("Unexpected database response format");
        }
        res.json(books);
    } catch (error) {
        console.error("Database Query Error:", error); // Log full error details
        res.status(500).json({ message: "Error retrieving books", error: error.message });
    }
});

// GET book by ID
router.get("/:book_id", async (req, res) => {
    try {
        const { book_id } = req.params;
        const [books] = await db.execute("SELECT * FROM Books WHERE book_id = ?", [book_id]);

        if (books.length === 0) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.json(books[0]); // Return only the first matching book
    } catch (error) {
        console.error("Error retrieving book:", error);
        res.status(500).json({ message: "Error retrieving book details", error: error.message });
    }
});


// GET books by genre
router.get("/genre/:genre", async (req, res) => {
    try {
        const { genre } = req.params;
        const [books] = await db.execute("SELECT * FROM Books WHERE genre = ?", [genre]);
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books by genre", error });
    }
});

// Search books by title
router.get("/search", async (req, res) => {
    try {
        const { title } = req.query;
        const [books] = await db.execute("SELECT * FROM Books WHERE title LIKE ?", [`%${title}%`]);
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Error searching books", error });
    }
});

module.exports = router;
