const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  title: String,
  screenshot: String,
  review: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Game", gameSchema);
