const express = require("express");
const path = require("path");
const passport = require("passport");
const session = require('express-session');
const DiscordStrategy = require("passport-discord").Strategy;
const bodyParser = require('body-parser');
const axios = require('axios');
const ejs = require('ejs');
const createPostRoute = require("./server/routes/createpost");

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

const posts = []; // Define an empty array to store posts

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
  res.render('index', { user: req.session.user });
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

app.get("/welcome", (req, res) => {
  if (req.isAuthenticated()) {
    const { username, discriminator, avatar } = req.user;

    console.log(req.user);
    
    // Retrieve all posts from your database
    // ...

    // Render the welcome template with user and posts data
    res.render("welcome", { user: req.user, posts: posts });
  } else {
    res.redirect("/");
  }
});

// app.post('/createpost', (req, res) => {
//   // Get the post text from the request body
//   const postText = req.body.postText;

//   // Use the Discord access token to get the user's name and profile picture
//   const discordAPI = `https://discord.com/api/v8/users/@me`;
//   const headers = {
//     Authorization: `Bearer ${req.session.passport.user.accessToken}`
//   };

//   axios.get(discordAPI, { headers })
//     .then(response => {
//       const discordName = response.data.username;
//       const discordProfilePicture = `https://cdn.discordapp.com/avatars/${response.data.id}/${response.data.avatar}.png`;

//       // Save the post to your database
//       // ...

//       // Redirect the user back to the welcome page
//       res.redirect('/welcome');
//     })
//     .catch(error => {
//       console.error(error);
//       res.status(500).send('Error creating post');
//     });
// });

app.use("/createpost", createPostRoute);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
