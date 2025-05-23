const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

require("dotenv").config();
const { login, createUser } = require("./controllers/users");
const { corsOptions } = require("./utils/config");
const { NOT_FOUND_ERROR_MESSAGE, NotFoundError } = require("./utils/errors");

const { PORT = 3001 } = process.env;
const app = express();

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.post("/signin", login);
app.post("/signup", createUser);

app.use("/users", require("./routes/users"));
app.use("/items", require("./routes/clothingItems"));

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use((req, res, next) => next(new NotFoundError(NOT_FOUND_ERROR_MESSAGE)));

// eslint-disable-next-line no-unused-vars
// app.use((err, req, res, next) => {
//   console.log(err);

//   if (err.statusCode) {
//     // Set default status code for unexpected errors
//     return res
//       .status(err.statusCode)
//       .send({ message: err.message, name: err.name });
//   }
//   return res.status(500).send({ message: "An error occurred on the server" });
// });
app.get("/test", (req, res) => {
  res.json({ message: "Test route working" });
});
app.use(errorLogger);
app.use(errors());

app.use(errorHandler);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.listen(PORT, () => {
  console.log(`App listening at ${PORT}`);
});
