const path = require('path');
const mongoose = require('mongoose');
const express = require("express");

// Safely load local .env variables if running outside production cloud runtime
require('dotenv').config();

const app = express();

app.use(express.json());

// CORS Configuration: Safe headers to prevent Cross-Origin execution blocks
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Serve static assets out of the root public directory (css, js, asset, codemirror)
app.use(express.static(path.join(__dirname, "public")));

// Import Routes
const compileRoutes = require("./routes/compile");

// Use Routes
app.use("/", compileRoutes);

// Home route (Defaulting to signin page on landing)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "pages", "user_auth", "signin.html"));
});

// Online IDE route
app.get("/ide", function (req, res) {
    res.sendFile(path.join(__dirname, "public", "pages", "compiler_page", "testCompiler.html"));
});

app.get("/playgroundRun", (req, res) => {
    
    res.sendFile(path.join(__dirname, "public", "pages", "compiler_page", "playground.html"));
});


app.get("/signin", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "pages", "user_auth", "signin.html"));
});


app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "pages", "user_auth", "signup.html"));
});

// Status check endpoint
app.get("/status", (req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
});


const PORT = process.env.PORT || 8000;


const dbURI = process.env.MONGODB_URI;

console.log(" Attempting direct MongoDB Atlas handshake via environment configuration...");

async function startServer() {
    if (!dbURI) {
        console.error(" CRITICAL SETUP ERROR: MONGODB_URI environment variable is missing.");
        process.exit(1);
    }

    try {
        await mongoose.connect(dbURI);
        console.log(" Live Database connected cleanly to MongoDB Atlas Cluster via secured environment variables!");
        
        app.listen(PORT, () => {
            console.log(` Server is successfully running live on port ${PORT}`);
            console.log(` Access the IDE live at /ide`);
        });
    } catch (err) {
        console.error(" CRITICAL DATABASE INITIALIZATION ERROR:");
        console.error(err.message || err);
        process.exit(1);
    }
}

startServer();