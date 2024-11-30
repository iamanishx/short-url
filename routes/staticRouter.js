const express = require("express");
const router = express.Router();

 router.get("/", (req, res) => {
    res.json({ message: "Welcome to the URL shortener API" });
});

router.get("/signup", (req, res) => {
    res.json({ message: "Signup endpoint (implement as needed)" });
});

module.exports = router;
