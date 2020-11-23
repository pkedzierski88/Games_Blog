const methodOverride = require("method-override"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  express = require("express"),
  expressSession = require("express-session"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose"),
  app = express(),
  Game = require("./models/game.js"),
  User = require("./models/user.js"),
  port = process.env.PORT || 3000,
  url = process.env.DATABASEURL || "mongodb://localhost:27017/game_blog_db" || "mongodb+srv://piotrek:password2020@games0.cbxab.mongodb.net/games_blog_db_deployed?retryWrites=true&w=majority";


mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
.then(() => console.log("Connected to Game Blog database server"))
.catch((err) => console.log(err.message));

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));


app.use(expressSession({
  secret: "This is some secret string",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

//LANDING
app.get("/", (req, res) => {
  res.render("landing.ejs");
});

//INDEX
app.get("/games", (req, res) => {
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
app.get("/games/new", isLoggedIn, (req, res) => {
  res.render("new.ejs");
});

//CREATE
app.post("/games", (req, res) => {
  Game.create(req.body, (err, newGame) => {
    if(err){
      console.log(err);
      res.render("new.ejs");
    } else {
      console.log("New Post Added:");
      console.log(newGame);
      res.redirect("/games");
    }
  });
});

//SHOW
app.get("/games/:id", (req, res) => {
  Game.findById(req.params.id, (err, foundGame) => {
    if(err){
      console.log(err);
      res.redirect("back");
    } else {
      res.render("show.ejs", {game: foundGame});
    }
  });
});

//EDIT
app.get("/games/:id/edit", isLoggedIn, (req, res) => {
  Game.findById(req.params.id, (err, foundGame) => {
    if(err){
      console.log(err);
      res.redirect("/games");
    } else {
      res.render("edit.ejs", {game: foundGame});
    }
  });
});

//UPDATE
app.put("/games/:id", (req, res) => {
    Game.findByIdAndUpdate(req.params.id, req.body, (err, updatedGame) => {
    if(err){
      console.log(err);
      res.redirect("/games");
    } else {
      res.redirect("/games/" + req.params.id)
    }
  });
});

//DELETE
app.delete("/games/:id", (req, res) => {
  Game.findByIdAndRemove(req.params.id, (err) => {
    if(err){
      console.log(err);
      res.redirect("/games");
    } else {
      res.redirect("/games");
    }
  });
});

//AUTH ROUTES
app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", (req, res) => {
  const newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user) => {
    if(err){
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/games");
      });
    }
  });
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post("/login", passport.authenticate("local", 
  {
    successRedirect: "/games",
    failureRedirect: "/login"
  }), (req, res) => {
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/games");
});

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  } 
  res.redirect("/login");
}

//Server
app.listen(port, () => {
  console.log("Server is listening on port " + port);
});