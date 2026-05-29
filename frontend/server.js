const path = require('path');
const mongoose = require('mongoose');
const express = require("express");


require('dotenv').config();

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});


app.use(express.static(path.join(__dirname, "public")));


const compileRoutes = require("./routes/compile");


app.use("/", compileRoutes);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "pages", "user_auth", "signin.html"));
});


app.get("/ide", function (req, res) {
    res.sendFile(path.join(__dirname, "public", "pages", "compiler_page", "testCompiler.html"));
});

app.get("/signin", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "pages", "user_auth", "signin.html"));
});


app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "pages", "user_auth", "signup.html"));
});


app.get("/status", (req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
});


const PORT = process.env.PORT || 8000;


const dbURI = process.env.MONGODB_URI;

console.log("⏳ Attempting direct MongoDB Atlas handshake via environment configuration...");

async function startServer() {
    if (!dbURI) {
        console.error("❌ CRITICAL SETUP ERROR: MONGODB_URI environment variable is missing.");
        process.exit(1);
    }

    try {
        await mongoose.connect(dbURI);
        console.log("🚀 Live Database connected cleanly to MongoDB Atlas Cluster via secured environment variables!");
        
        app.listen(PORT, () => {
            console.log(`📡 Server is successfully running live on port ${PORT}`);
            console.log(`💻 Access the IDE live at /ide`);
        });
    } catch (err) {
        console.error("❌ CRITICAL DATABASE INITIALIZATION ERROR:");
        console.error(err.message || err);
        process.exit(1);
    }
}

startServer();