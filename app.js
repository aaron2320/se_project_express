// Import required packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import routes
const itemsRouter = require("./routes/clothingItems");
const usersRouter = require("./routes/users");

// Import custom error constants
const { NOT_FOUND } = require("./utils/errors");

// Create the Express app
const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Temporary authentication middleware (replace later with real auth)
app.use((req, res, next) => {
  req.user = { _id: "5d8b8592978f8bd833ca8133" }; // Example user ID
  next();
});

// Routes
app.use("/users", usersRouter);
app.use("/items", itemsRouter);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err.stack); // Log full error stack
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "An error occurred on the server" : message,
  });
});

// Export the app for use in index.js
module.exports = app;
