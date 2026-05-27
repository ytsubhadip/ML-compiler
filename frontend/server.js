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

<<<<<<< Updated upstream
// online IDE route
app.get("/ide", function (req, res) {
    res.sendFile(path.join(__dirname, "public", "ide.html"));
});
=======
// online playground
app.get("/playground", function (req, res) {

    res.sendFile(path.join(__dirname, "public", "playground.html"))
})


>>>>>>> Stashed changes

app.get("/status", (req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
});

// Added the callback function to log the startup message
const PORT = 8000;
app.listen(PORT, () => {
    console.log(` Server is successfully running on http://localhost:${PORT}`);
    console.log(`  Access the IDE at http://localhost:${PORT}/ide`);
});