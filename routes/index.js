const express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  User = require("../models/user.js");

//LANDING
router.get("/", (req, res) => {
  res.render("landing.ejs");
});

//AUTH ROUTES
router.get("/register", (req, res) => {
  res.render("register.ejs");
});

router.post("/register", (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/games");
      });
    }
  });
});

router.get("/login", (req, res) => {
  res.render("login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/games",
    failureRedirect: "/login",
  }),
  (req, res) => {}
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/games");
});

module.exports = router;
