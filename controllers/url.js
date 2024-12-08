
require('dotenv').config()
const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "URL is required" });

  const shortID = shortid();

   await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitHistory: [],
  });
//updated 
   return res.status(201).json({
    shortUrl: `trmzip.club/${shortID}`,   
    shortId: shortID,                            
  });
}



async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });

  if (!result) {
    return res.status(404).json({ error: "Short URL not found" });
  }

  return res.status(200).json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};
