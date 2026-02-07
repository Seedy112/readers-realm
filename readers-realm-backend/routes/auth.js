const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");
require("dotenv").config();
const router = express.Router();

// **User Registration Route**
router.post("/register", async (req, res) => {
    console.log("Received Data in Backend:", req.body);
    const { fullname, email, phone, dob, gender, username, password, favgenre, about, newsletter } = req.body;

    try {
        // Check if user already exists
        const checkUserQuery = "SELECT * FROM Users WHERE email = ? OR username = ?";
        const [existingUsers] = await db.query(checkUserQuery, [email, username]);

        if (existingUsers.length > 0) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into database
        const insertUserQuery = `
            INSERT INTO Users (fullname, email, phone, dob, gender, username, password, favgenre, about, newsletter)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await db.query(insertUserQuery, [
            fullname, email, phone, dob, gender, username, hashedPassword, favgenre, about, newsletter ? 1 : 0
        ]);

        console.log("User Inserted Successfully!");
        return res.status(201).json({ message: "User registered successfully!" });

    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ error: error.message || "Server error" });
    }
});

// **User Login Route**
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(401).json({ message: "Username and password are required" });
    }

    try {
        // Check if the user exists
        const query = "SELECT user_id, email, username, password FROM Users WHERE username = ?";
        const [results] = await db.query(query, [username]);

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const user = results[0];

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.user_id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login successful!",
            user: { id: user.user_id, email: user.email, username: user.username },
            token
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/verify-token", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const [rows] = await db.query(
            "SELECT user_id, username FROM Users WHERE user_id = ?",
            [decoded.id]
        );

        if (rows.length === 0) return res.status(401).json({ error: "User not found" });

        res.json({ user_id: rows[0].user_id, username: rows[0].username });
    } catch (error) {
        console.error("Token verification error:", error);
        res.status(401).json({ error: "Invalid token" });
    }
});

module.exports = router;
