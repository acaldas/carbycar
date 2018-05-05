const express = require("express");
const baseRouter = require("./base");
const usersRouter = require("./users");

const app = express();

app.use("/", baseRouter);
app.use("/users", usersRouter);

module.exports = app;
