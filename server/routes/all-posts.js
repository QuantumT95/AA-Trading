// routes/posts.js
const express = require("express");
const router = express.Router();
const { db } = require("../../mongo.js");

router.get("/", async (req, res) => {
  try {
    const posts = await db.collection("Posts").find({}).toArray();
    res.render("posts", { posts: posts });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;