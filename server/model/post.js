const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userDiscordId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  trade: {
    type: String,
    required: true,
  },
  want: {
    type: String,
    required: true,
  },
  isOpen: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;