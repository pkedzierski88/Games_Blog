const methodOverride = require("method-override"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  Game = require("./models/game.js"),
  express = require("express"),
  app = express(),
  port = process.env.PORT || 3000,
  url = process.env.DATABASEURL || "mongodb://localhost:27017/game_blog_db" || "mongodb+srv://piotrek:password2020@games0.cbxab.mongodb.net/games_blog_db_deployed?retryWrites=true&w=majority";

app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log("Connected to Game Blog database server"))
  .catch((err) => console.log(err.message));


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
app.get("/games/new", (req, res) => {
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
app.get("/games/:id/edit", (req, res) => {
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

app.listen(port, () => {
  console.log("Server is listening on port " + port);
});