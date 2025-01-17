const express = require("express"),
  router = express.Router(),
  middleware = require("../middleware/index.js"),
  Game = require("../models/game.js");

//INDEX
router.get("/games", (req, res) => {
  Game.find({}, (err, allGames) => {
    if (err) {
      console.log(err);
      res.redirect("landing.ejs");
    } else {
      res.render("index.ejs", { games: allGames });
    }
  });
});

//NEW
router.get("/games/new", middleware.isLoggedIn, (req, res) => {
  res.render("new.ejs");
});

//CREATE
router.post("/games", middleware.isLoggedIn, (req, res) => {
  let title = req.body.title;
  let screenshot = req.body.screenshot;
  let review = req.body.review;
  let author = { id: req.user._id, username: req.user.username };
  let newGame = {
    title: title,
    screenshot: screenshot,
    review: review,
    author: author,
  };
  Game.create(newGame, (err, gamePost) => {
    if (err) {
      console.log(err);
      res.render("new.ejs");
    } else {
      console.log("New Post Added:");
      console.log(gamePost);
      res.redirect("/games");
    }
  });
});

//SHOW
router.get("/games/:id", (req, res) => {
  Game.findById(req.params.id, (err, foundGame) => {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.render("show.ejs", { game: foundGame });
    }
  });
});

//EDIT
router.get("/games/:id/edit", middleware.checkPostOwner, (req, res) => {
  Game.findById(req.params.id, (err, foundGame) => {
    if (err) {
      console.log(err);
      res.redirect("/games");
    } else {
      res.render("edit.ejs", { game: foundGame });
    }
  });
});

//UPDATE
router.put("/games/:id", middleware.checkPostOwner, (req, res) => {
  Game.findByIdAndUpdate(req.params.id, req.body, (err, updatedGame) => {
    if (err) {
      console.log(err);
      res.redirect("/games");
    } else {
      res.redirect("/games/" + req.params.id);
    }
  });
});

//DELETE
router.delete("/games/:id", middleware.checkPostOwner, (req, res) => {
  Game.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      console.log(err);
      res.redirect("/games");
    } else {
      res.redirect("/games");
    }
  });
});

module.exports = router;
