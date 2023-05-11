const express = require("express");
const router = express.Router();
const { client } = require("../../mongo");
const { Post } = require("../model/post");

router.get("/", async (req, res) => {
  try {
    const posts = await client.db().collection("Posts").find().toArray();
    res.render("home", { posts });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving posts");
  }
});

router.get("/allposts", async (req, res) => {
  try {
    const posts = await client.db().collection("Posts").find().toArray();
    res.render("allposts", { posts });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving posts");
  }
});

module.exports = router;
