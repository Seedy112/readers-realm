require("dotenv").config();
const mysql = require("mysql2");

// Use a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise(); // Convert to Promise-based API

// Test the connection
pool.getConnection()
    .then(connection => {
        console.log("Connected to database");
        connection.release();
    })
    .catch(err => {
        console.error("Database connection failed:", err.stack);
    });

module.exports = pool;
