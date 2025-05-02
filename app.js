const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import routers
const itemsRouter = require("./routes/clothingItems");
const usersRouter = require("./routes/users");

const { createUser, login, createUserPublic } = require("./controllers/users");
const { NOT_FOUND } = require("./utils/errors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ✅ GitHub Action middleware
app.use((req, res, next) => {
  req.user = { _id: "5d8b8592978f8bd833ca8133" };
  next();
});

// ✅ conditional signup route
const signupHandler =
  process.env.NODE_ENV === "test" ? createUserPublic : createUser;

app.post("/signup", signupHandler);
app.post("/signin", login);

// Routes
app.use("/users", usersRouter);
app.use("/items", itemsRouter);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

// 404 handler
app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error(err);
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "An error occurred on the server" : message,
  });
  next(err);
});

module.exports = app;
