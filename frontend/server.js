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

// online IDE route
app.get("/ide", function (req, res) {

    res.sendFile(path.join(__dirname, "public", "pages/compiler_page/testCompiler.html"))
})

// signin route
app.get("/signin",(req, res)=>{
    res.sendFile(path.join(__dirname, "public", "pages/user_auth/signin.html"))
} )

// signup route
app.get("/signup",(req, res)=>{
    res.sendFile(path.join(__dirname, "public", "pages/user_auth/signup.html"))
} )


app.get("/status", (req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
});

// Added the callback function to log the startup message
const PORT = 8000;
app.listen(PORT, () => {
    console.log(` Server is successfully running on http://localhost:${PORT}`);
    console.log(`  Access the IDE at http://localhost:${PORT}/ide`);
});