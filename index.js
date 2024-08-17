const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const staticRoute = require('./routes/staticRouter');
const path = require('path');
const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://localhost:27017/short-url").then(() =>
  console.log("Mongodb connected")
);
app.set("view engine","ejs");
app.set('views', path.resolve("./views"))

app.use(express.json());
app.use(express.urlencoded({extended:false}));
 
app.use("/url", urlRoute);
app.use("/", staticRoute);


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


app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
