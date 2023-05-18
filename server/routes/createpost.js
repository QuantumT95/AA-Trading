const express = require("express");
const router = express.Router();
const { client, connect } = require('../../mongo.js');

router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    // Render the create post form
    res.render("createpost");
  } else {
    // Redirect to the login page
    res.redirect("/login");
  }
});

router.post("/createpost", (req, res) => {
  if (req.isAuthenticated()) {
    // Get the post data from the form
    const postText = req.body.postText;
    const trade = req.body.trade;
    const want = req.body.want;
    const isOpen = req.body.isOpen;
    const createdAt = new Date();
    
    // Get the user's Discord ID
    const userDiscordId = req.user.username + "#" + req.user.discriminator;

    // Create a new post and insert it into the database
    const post = {
      userDiscordId,
      text: postText,
      trade,
      want,
      isOpen,
      createdAt,
    };

    const db = client.db("test");
    const postsCollection = db.collection("posts");
    
    postsCollection.insertOne(post, (err, result) => {
      if (err) {
        console.log(err);
        res.redirect("/welcome");
      } else {
        console.log("Successfully created a new post!");
        res.redirect("/");
      }
    });
  } else {
    // Redirect to the login page
    res.redirect("/");
  }
});

module.exports = router;
