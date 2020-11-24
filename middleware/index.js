const Game = require("../models/game.js");

let middlewareObject = {};

middlewareObject.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

middlewareObject.checkPostOwner = (req, res, next) => {
  if (req.isAuthenticated()) {
    Game.findById(req.params.id, (err, foundGame) => {
      if (err || !foundGame) {
        console.log(err);
        res.redirect("back");
      } else {
        if (foundGame.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};

module.exports = middlewareObject;
