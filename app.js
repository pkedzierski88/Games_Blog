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
//     title: "The Legend of Zelda: Breath of the Wild",
//     screenshot: "https://www.nintendo.com/content/dam/noa/en_US/games/switch/t/the-legend-of-zelda-breath-of-the-wild-switch/the-legend-of-zelda-breath-of-the-wild-switch-hero.jpg",
//     review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vulputate sit amet odio ac interdum. In eget dictum diam, ut ornare sem. Nunc augue orci, fringilla nec tristique a, aliquam eu arcu. Nulla id sem lectus. Maecenas mattis tincidunt urna, in pretium elit congue vel. Sed sollicitudin pulvinar odio, at hendrerit ligula finibus a. Aliquam nibh odio, suscipit a vestibulum commodo, placerat in metus. Nullam interdum lacus eget erat imperdiet pellentesque. Sed enim libero, posuere non pellentesque et, lacinia sed lacus. Nunc suscipit lectus ut diam lacinia malesuada. Vestibulum at sodales nisi. Curabitur varius luctus lectus quis aliquet. Praesent felis turpis, pulvinar vel convallis eu, blandit at nisi. Nam bibendum dignissim congue.",
//     author: "Piotr Kedzierski"
// }, (err, createdGame) => {
//     if(err){
//         console.log(err);
//     } else {
//         console.log(createdGame);
//     }
// });

app.get("/", (req, res) => {
  res.redirect("/games");
});

app.get("/games", (req, res) => {
  Game.find({}, (err, allGames) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index.ejs", { games: allGames });
    }
  });
});

app.listen(port, () => {
  console.log("Server is listening on port " + port);
});
