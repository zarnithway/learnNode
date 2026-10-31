const express = require("express");
const logger = require("./src/middleware/logger");
const { notFound, errorHandler } = require("./src/middleware/errorHandler");
const todoRoutes = require("./src/routes/todos");

const app = express();

app.use(express.json());
app.use(logger);

app.use("/todos", todoRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;