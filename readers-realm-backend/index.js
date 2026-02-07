require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const db = require("./db"); // Import database connection

const app = express();
app.use(express.json()); // Middleware to parse JSON requests
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: "*",  
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization"
};

app.use(cors(corsOptions)); 

//app.options("*", cors()); 
app.options("*", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.status(204).end();
});


//route for register
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

//route for catalog
const bookRoutes = require("./routes/books");
app.use("/api/books", bookRoutes);

//route for reviews
const reviewsRoutes = require("./routes/reviews");
app.use("/api/reviews", reviewsRoutes);

// Route for events
const eventsRoutes = require("./routes/events");
app.use("/api/events", eventsRoutes);

// Route for discussion
const discussionsRoutes = require("./routes/discussions");
app.use("/api/discussions", discussionsRoutes);

// Route for user profiles
const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes);

// Route for contact
const contactRoutes = require("./routes/contact");
app.use("/api/contact", contactRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("Welcome to Reader's Realm Backend!");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
