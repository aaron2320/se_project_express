const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Importing routers
const itemsRouter = require("./routes/clothingItems");
const usersRouter = require("./routes/users");

// Importing middlewares and controllers
const auth = require("./middlewares/auth");
const { createUser, login } = require("./controllers/users");
const { NOT_FOUND } = require("./utils/errors");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Public routes
app.post("/signup", createUser);
app.post("/signin", login);

// Protected routes
app.use("/users", usersRouter);
app.use(
  "/items",
  (req, res, next) => {
    if (req.method === "GET") {
      return next();
    }
    return auth(req, res, next);
  },
  itemsRouter
);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

// 404 middleware for unhandled routes
app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

// Central error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? "An error occurred on the server" : message,
  });
  next(err);
});

module.exports = app;
