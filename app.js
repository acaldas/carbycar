const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const mongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");

const routes = require("./routes");

const app = express();

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const session_secret = process.env.SESSION_SECRET || "aaa";
app.use(cookieParser());
app.use(
    session({
        secret: session_secret,
        resave: false,
        saveUninitialized: true,
        store: new mongoStore({ mongooseConnection: db })
    })
);
app.use(express.static(path.join(__dirname, "public")));

app.use(function(req, res, next) {
    let username = req.session.username;
    res.locals.username = username;
    res.locals.authenticated = username && username.length;
    next();
});

app.use(routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
