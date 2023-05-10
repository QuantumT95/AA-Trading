const express = require('express');
const router = express.Router();
const {
  homePage,
  tradePage,
  searchPage,
  createPost,
  deletePost,
  login,
  logout,
} = require('./controllers');

const { isLoggedIn } = require('./middlewares');

// Home page route
router.route('/')
  .get(homePage);

// Trade page route
router.route('/trade')
  .get(tradePage);

// Search page route
router.route('/search')
  .get(searchPage);

// Create post route
router.route('/create')
  .get(isLoggedIn, createPost)
  .post(isLoggedIn, createPost);

// Delete post route
router.route('/delete/:id')
  .get(isLoggedIn, deletePost);

// Login route
router.route('/login')
  .get(login)
  .post(login);

// Logout route
router.route('/logout')
  .get(logout);

module.exports = router;
