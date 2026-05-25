const express = require("express")
const path = require('path')
const bodyP = require('body-parser')
const app = express()

app.use(bodyP.json())
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")));

// Import Routes
const compileRoutes = require("./routes/compile");

// Use Routes
// mount compile router at root so its internal '/compiler' path becomes '/compiler'
app.use("/", compileRoutes);

app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/ide", function (req, res) {

    res.sendFile(path.join(__dirname, "public", "ide.html"))
})



app.get("/status", (req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
});


app.listen(8000)
