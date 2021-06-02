const express = require("express");
const app = express();
const path = require("path");
var morgan = require("morgan");
let Port = process.env.PORT || 8080;
var session = require("express-session");
let AddProduct = require("./routers/AddProduct");
let login = require("./routers/login");
let category = require("./routers/category");
require("./db/db");
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000000, // Time is in miliseconds
    },
  })
);

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname + "/public/")));
app.use(express.json());

const auth = function (req, res, next) {
  console.log(req.session.loggedin);
  if (req.session.loggedin) {
    next();
  } else {
    res.redirect("/");
  }
};
app.use(function (req, res, next) {
  res.setHeader(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});
app.use("/admin", auth, AddProduct);
app.use("/admin", auth, category);
app.use("/", login);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});
app.get("/Admin", auth, (req, res) => {
  res.sendFile(path.join(__dirname, "Admin.html"));
});
app.get("/logout", (req, res) => {
  req.session.loggedin = false;
  res.redirect("/");
});

app.listen(Port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`server is runing ${Port}`);
});
