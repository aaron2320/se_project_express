const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const itemsRouter = require("./routes/clothingItems");
const usersRouter = require("./routes/users");
const { NOT_FOUND } = require("./utils/errors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ✅ inject mock user for testing
app.use((req, res, next) => {
  req.user = { _id: "5d8b8592978f8bd833ca8133" };
  next();
});

// ✅ mount routers at /users and /items
app.use("/users", usersRouter);
app.use("/items", itemsRouter);

// ✅ handle unknown routes
app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

// ✅ centralized error handler
app.use((err, req, res, next) => {
  console.error(err);
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "An error occurred on the server" : message,
  });
  next(err);
});

// ✅ connect to MongoDB and start the server
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
    app.listen(3001, () => {
      console.log("Server is listening on port 3001");
    });
  })
  .catch(console.error);
