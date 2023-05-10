const express = require("express");
const router = express.Router();

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

    // Create a new post and save it to the database
    // ...

    // Redirect the user to the welcome page
    res.redirect("/welcome");
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
    const isOpen = req.body.isOpen === "true";

    // Create a new post and save it to the database
    const post = new Post({
      userDiscordId: req.user.id,
      text: postText,
      trade: trade,
      want: want,
      isOpen: isOpen,
    });
    post.save((err) => {
      if (err) {
        console.log(err);
        res.send("Error saving post to database.");
      } else {
        // Redirect the user to the welcome page
        res.redirect("/welcome");
      }
    });
  } else {
    // Redirect to the login page
    res.redirect("/login");
  }
});


// router.post("/", async (req, res) => {
//   if (req.isAuthenticated()) {
//     // Get the post data from the form
//     const { postText, trade, want, isOpen } = req.body;

//     // Create a new post and save it to the database
//     try {
//       const newPost = await Post.create({
//         userDiscordId: req.user.id,
//         text: postText,
//         trade: trade,
//         want: want,
//         isOpen: isOpen === "on", // checkbox will send "on" string if checked
//       });
//       console.log("New post created:", newPost);
//     } catch (error) {
//       console.error("Error creating new post:", error);
//       // Redirect the user to the welcome page with an error message
//       return res.render("createpost", { error: "Failed to create new post." });
//     }

//     // Redirect the user to the welcome page
//     res.redirect("/welcome");
//   } else {
//     // Redirect to the login page
//     res.redirect("/login");
//   }
// });


module.exports = router;