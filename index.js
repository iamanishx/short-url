require('dotenv').config()
const express = require("express");
const { connectToMongoDB } = require("./connect");
const URL = require("./models/url");
const cors = require('cors');

const app = express();
const PORT = process.env.PORT;



 const urlRoute = require("./routes/url");
const userRoute = require("./routes/user");

 connectToMongoDB(process.env.MONGO).then(() =>
  console.log("MongoDB connected")
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());


// Routes
app.use("/url", urlRoute);
app.use("/user", userRoute);

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

 app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
