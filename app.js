const methodOverride = require("method-override"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  Game = require("./models/game.js"),
  express = require("express"),
  app = express(),
  port = process.env.PORT || 3000,
  url = process.env.DATABASEURL || "mongodb://localhost:27017/game_blog_db";

app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to Game Blog database server"))
  .catch((err) => console.log(err.message));

// Game.create({
//     title: "SHORT ZELDA",
//     screenshot: "https://www.nintendo.com/content/dam/noa/en_US/games/switch/t/the-legend-of-zelda-breath-of-the-wild-switch/the-legend-of-zelda-breath-of-the-wild-switch-hero.jpg",
//     review: "Lorem ipsum",
//     author: "Julita Kedzierska"
// }, (err, createdGame) => {
//     if(err){
//         console.log(err);
//     } else {
//         console.log(createdGame);
//     }
// });

//LANDING
app.get("/", (req, res) => {
  res.redirect("/games");
});

//INDEX
app.get("/games", (req, res) => {
  Game.find({}, (err, allGames) => {
    if (err) {
      console.log(err);
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
      res.render("new.ejs");
    } else {
      res.redirect("/games");
    }
  });
});

//SHOW
app.get("/games/:id", (req, res) => {
  Game.findById(req.params.id, (err, foundGame) => {
    if(err){
      res.redirect("back");
    } else {
      res.render("show.ejs", {game: foundGame});
    }
  });
});


app.listen(port, () => {
  console.log("Server is listening on port " + port);
});
