const methodOverride = require("method-override"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  express = require("express"),
  expressSession = require("express-session"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  app = express(),
  User = require("./models/user.js"),
  indexRoutes = require("./routes/index.js"),
  gamesRoutes = require("./routes/games.js"),
  port = process.env.PORT || 3000,
  url =
    process.env.DATABASEURL ||
    "mongodb://localhost:27017/game_blog_db" ||
    "mongodb+srv://piotrek:password2020@games0.cbxab.mongodb.net/games_blog_db_deployed?retryWrites=true&w=majority";

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to Game Blog database server"))
  .catch((err) => console.log(err.message));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));

app.use(
  expressSession({
    secret: "This is some secret string",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

//Routes
app.use(indexRoutes);
app.use(gamesRoutes);

//Server
app.listen(port, () => {
  console.log("Server is listening on port " + port);
});
