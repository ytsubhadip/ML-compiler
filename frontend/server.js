const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); 

const mongoose = require('mongoose');
const express = require("express");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Import Routes
const compileRoutes = require("./routes/compile");

// Use Routes
app.use("/", compileRoutes);

// Home route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Online IDE route
app.get("/ide", function (req, res) {
    res.sendFile(path.join(__dirname, "public", "ide.html"));
});

app.get("/status", (req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
});

const PORT = process.env.PORT || 8000;

// Tell Mongoose to strictly use Render's injected environment string
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("🚀 Live Database connected cleanly to MongoDB Atlas Cluster!");
        
        app.listen(PORT, () => {
            console.log(`📡 Server is successfully running live on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("❌ Live Database connection failure during startup:", err);
        process.exit(1);
    });