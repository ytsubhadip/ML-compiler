const express = require("express");
const path = require('path');

const app = express();

// You only need express.json() - body-parser is redundant in modern Express
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Import Routes
const compileRoutes = require("./routes/compile");

// Use Routes
app.use("/", compileRoutes);

// home route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// online playground
app.get("/playground", function (req, res) {

    res.sendFile(path.join(__dirname, "public", "playground.html"))
})

// online Test compiler
app.get("/ide", function (req, res) {

    res.sendFile(path.join(__dirname, "public", "ide.html"))
})

// signin route
app.get("/signin",(req, res)=>{
    res.sendFile(path.join(__dirname, "public", "signin.html"))
} )

// signup route
app.get("/signup",(req, res)=>{
    res.sendFile(path.join(__dirname, "public", "signup.html"))
} )


app.get("/status", (req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
});

// Added the callback function to log the startup message
const PORT = 8000;
app.listen(PORT, () => {
    console.log(` Server is successfully running on http://localhost:${PORT}`);
});