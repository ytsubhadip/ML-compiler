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


const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher'], default: 'student' },
    roleIdentifier: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});


const User = mongoose.models.User || mongoose.model('User', UserSchema);

const compileRoutes = require("./routes/compile");
app.use("/", compileRoutes);


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "pages", "user_auth", "signin.html"));
});


app.get("/ide", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "pages", "compiler_page", "testCompiler.html"));
});


app.get("/playground", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "pages", "compiler_page", "playground.html"));
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


app.post("/signup", async (req, res) => {
    try {
        const { name, email, password, role, roleIdentifier } = req.body;

        if (!name || !email || !password || !roleIdentifier) {
            return res.status(400).json({ error: "Required fields are missing." });
        }

        const existingAccount = await User.findOne({ email: email.toLowerCase() });
        if (existingAccount) {
            return res.status(400).json({ error: "An account with this email address already exists." });
        }

        const registeredUser = await User.create({
            name,
            email,
            password, 
            role,
            roleIdentifier
        });

        return res.status(201).json({ message: "Registration successful!", userId: registeredUser._id });

    } catch (err) {
        console.error("Database structural mismatch during registration validation workflow:", err);
        return res.status(500).json({ error: "Internal processing crash dropped transaction logs." });
    }
});


app.post("/signin", async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Missing identity validation metrics parameters." });
        }

        const accountProfile = await User.findOne({ email: email.toLowerCase(), role: role });
        if (!accountProfile || accountProfile.password !== password) {
            return res.status(401).json({ error: "Access Denied: Invalid email credentials, password, or persona role context." });
        }

        return res.status(200).json({
            message: "Authentication sequence passed.",
            name: accountProfile.name,
            role: accountProfile.role,
            token: "mock-session-auth-token-id" 
        });

    } catch (err) {
        console.error("Database verification breakdown inside core login path handlers:", err);
        return res.status(500).json({ error: "Internal authentication gate dropped connection." });
    }
});

 //Production Environment Synchronization Lifecycles 
const PORT = process.env.PORT || 8000;
const dbURI = process.env.MONGODB_URI;

async function runProductionEngine() {
    if (!dbURI) {
        console.error("❌ CRITICAL PROCESS ABORTED: MONGODB_URI entry value parameter is undefined inside active environmental arrays.");
        process.exit(1);
    }

    try {
        console.log(" Attempting direct MongoDB Atlas handshake via environment configuration...");
        await mongoose.connect(dbURI);
        console.log(" Live Database connected cleanly to MongoDB Atlas Cluster via secured environment variables!");
        
        app.listen(PORT, () => {
            console.log(` Server is successfully running live on port ${PORT}`);
            console.log(` Access the IDE live at /ide`);
        });
    } catch (runtimeCrash) {
        console.error("CRITICAL DATABASE INITIALIZATION ERROR:");
        console.error(runtimeCrash.message || runtimeCrash);
        process.exit(1);
    }
}

runProductionEngine();