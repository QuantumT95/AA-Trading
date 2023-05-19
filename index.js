const express = require("express");
const path = require("path");
const passport = require("passport");
const session = require('express-session');
const DiscordStrategy = require("passport-discord").Strategy;
const bodyParser = require('body-parser');
const axios = require('axios');
const ejs = require('ejs');
const createPostRoute = require("./server/routes/createpost");
const postsRoute = require("./server/routes/all-posts");
const homeRoutes = require("./server/routes/home");
const Post = require("./server/model/post");
require("./mongoose");
const validUnits = require('./utils/units');


const app = express();

const { client, connect } = require('./mongo.js');

// Call the connect function to connect to the database
connect();

app.set('view engine', 'ejs');


const myID = process.env['CLIENT_ID'];
const mySecret = process.env['CLIENT_SECRET'];
const mySessionSecret = process.env['SESSION_SECRET']

app.use(session({
  secret: mySessionSecret,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new DiscordStrategy(
    {
      clientID: myID,
      clientSecret: mySecret,
      callbackURL: "https://aa-trading.quantumt95.repl.co/auth/discord/callback",
      scope: ["identify"],
    },
    (accessToken, refreshToken, profile, done) => {
      // store access token in user's session
      const user = {accessToken: accessToken, profile: profile};
      return done(null, profile);
    }
  )
);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("./"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  const user = req.user;
  const perPage = 10; // Number of posts per page
  const page = parseInt(req.query.page) || 1; // Current page number (default: 1)
  
  try {
    // Retrieve posts from the database with pagination
    const posts = await Post.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();
    console.log(posts); // check if posts are being fetched correctly
    res.render("home", { user: user, posts: posts, validUnits, currentPage: page });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
  // try {
  //   const posts = await Post.find({});
  //   console.log(posts); // check if posts are being fetched correctly
  //   res.render("home", { user: user, posts: posts, validUnits });
  // } catch (err) {
  //   console.log(err);
  // }
});

app.get(
  "/auth/discord",
  passport.authenticate("discord", { scope: ["identify"] })
);

app.get(
  "/auth/discord/callback",
  passport.authenticate("discord", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/welcome");
  }
);

app.get("/welcome", async (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user;

    try {
      const posts = await Post.find();
      res.render("welcome", { user, posts, validUnits });
    } catch (err) {
      console.log(err);
      res.redirect("/");
    }
  } else {
    res.redirect("/");
  }
});

app.get("/search", async (req, res) => {
  const { trade, want } = req.query;
  let query = {};

  if (trade) {
    const escapedTrade = escapeRegex(trade);
    query.trade = { $regex: escapedTrade, $options: "i" };
  }

  if (want) {
    const escapedWant = escapeRegex(want);
    query.want = { $regex: escapedWant, $options: "i" };
  }

  try {
    const posts = await Post.find(query);

    res.render("search-results", { posts, trade, want });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

app.use("/createpost", createPostRoute);
app.post("/createpost", createPostRoute);

app.use("/posts", postsRoute);

// Delete a post
// app.delete("/posts/:postId", async (req, res) => {
//   if (req.isAuthenticated()) {
//     const postId = req.params.postId;
//     const userId = req.user.username + "#" + req.user.discriminator;

//     try {
//       const post = await Post.findById(postId);

//       if (!post) {
//         // Post not found
//         return res.status(404).json({ error: "Post not found" });
//       }

//       if (post.userDiscordId !== userId) {
//         // User is not authorized to delete the post
//         return res.status(403).json({ error: "Unauthorized" });
//       }

//       // Delete the post from the database
//       await post.remove();

//       return res.status(200).json({ message: "Post deleted successfully" });
//     } catch (error) {
//       console.log(error);
//       return res.status(500).json({ error: "Internal server error" });
//     }
//   } else {
//     // User is not authenticated
//     return res.status(401).json({ error: "Unauthorized" });
//   }
// });


app.listen(3000, () => {
  console.log("Server started on port 3000");
});
