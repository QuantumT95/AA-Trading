const express = require("express");
const router = express.Router();
require("../../mongoose");

router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    // Render the create post form
    res.render("createpost");
  } else {
    // Redirect to the login page
    res.redirect("/login");
  }
});

router.post("/", (req, res) => {
  if (req.isAuthenticated()) {
    // Get the post data from the form
    const postText = req.body.postText;
    const trade = req.body.trade;
    const want = req.body.want;
    const isOpen = req.body.isOpen;
    
    // Get the user's Discord ID
    const userDiscordId = req.user.id;

    // Create a new post and insert it into the database
    const post = {
      userDiscordId,
      text: postText,
      trade,
      want,
      isOpen,
    };
    db.collection("Posts").insertOne(post, (err, result) => {
      if (err) {
        console.log(err);
        res.redirect("/createpost");
      } else {
        console.log("Successfully created a new post!");
        res.redirect("/welcome");
      }
    });
  } else {
    // Redirect to the login page
    res.redirect("/login");
  }
});

module.exports = router;
