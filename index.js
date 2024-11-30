const express = require("express");
const { connectToMongoDB } = require("./connect");
const URL = require("./models/url");

const app = express();
const PORT = 8001;

// Routes
const urlRoute = require("./routes/url");
const userRoute = require("./routes/user");

// Connect to MongoDB
connectToMongoDB("mongodb://localhost:27017/short-url").then(() =>
  console.log("MongoDB connected")
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/url", urlRoute);
app.use("/user", userRoute);

// Redirect based on short URL
app.get("/:shortId", async (req, res) => {
  try {
    const shortId = req.params.shortId;

    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visitHistory: { timestamp: Date.now() } } },
      { new: true }
    );

    if (entry) {
      res.redirect(entry.redirectURL);
    } else {
      res.status(404).send("URL not found");
    }
  } catch (error) {
    console.error("Error finding or updating URL:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start server
app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
