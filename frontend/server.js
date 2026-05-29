const path = require('path');
const mongoose = require('mongoose');
const express = require("express");

const app = express();

app.use(express.json());

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

// Signin route
app.get("/signin", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "pages", "user_auth", "signin.html"));
});

// Signup route
app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "pages", "user_auth", "signup.html"));
});

// Status check endpoint
app.get("/status", (req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
});

// Dynamic port assignment for Render deployment, falling back to 8000 locally
const PORT = process.env.PORT || 8000;

// Corrected absolute cloud connection string literal
const productionURI = "mongodb+srv://sheikhrahul18581_db_user:Skrahul06@botalsepaisa.uvp16kf.mongodb.net/ml-compiler?retryWrites=true&w=majority&appName=botalsepaisa";

console.log("⏳ Attempting direct MongoDB Atlas handshake...");

mongoose.connect(productionURI)
    .then(() => {
        console.log("🚀 Live Database connected cleanly to MongoDB Atlas Cluster [ml-compiler]!");
        
        app.listen(PORT, () => {
            console.log(`📡 Server is successfully running live on port ${PORT}`);
            console.log(`💻 Access the IDE live at /ide`);
        });
    })
    .catch(err => {
        console.error("❌ Live Database connection failure during startup:", err);
        process.exit(1);
    });