const express = require("express");
const baseRouter = require("./base");
const routesRouter = require("./routes");
const usersRouter = require("./users");

const app = express();

app.use("/", baseRouter);
app.use("/routes", routesRouter);
app.use("/users", usersRouter);

module.exports = app;
