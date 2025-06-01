require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import Celebrate and Joi for validation
const { celebrate, Joi } = require("celebrate");

const { errors } = require("celebrate");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const { login, createUser } = require("./controllers/users");
const { corsOptions } = require("./utils/config");

// Import error classes and messages
const NotFoundError = require("./utils/errors/NotFoundError");
const { NOT_FOUND_ERROR_MESSAGE } = require("./utils/errorMessages");

const { PORT = 3001 } = process.env;
const app = express();

// Explicit CORS setup
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

// Middleware to block .git requests
app.use((req, res, next) => {
  if (req.path.includes(".git")) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
});

// Other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

// Routes with validation
app.post("/signin", celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post("/signup", celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().uri({ scheme: ["http", "https"] }),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.use("/users", require("./routes/users"));
app.use("/items", require("./routes/clothingItems"));

app.get("/test", (req, res) => {
  res.json({ message: "Test route working" });
});

// 404 Handler using NotFoundError class
app.use((req, res, next) => {
  console.log("404 Handler triggered for path:", req.path);
  next(new NotFoundError(NOT_FOUND_ERROR_MESSAGE));
});

// Error logging and handling
app.use(errorLogger);
app.use(errors());

app.use(errorHandler);

// MongoDB connection with default URI
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/wtwr_dev")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Function to start server with port fallback and bind to all interfaces
const startServer = (port) => {
  app
    .listen(port, '0.0.0.0', () => {
      console.log(`App listening at ${port}`);
    })
    .on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.log(`Port ${port} is in use, trying ${port + 1}...`);
        startServer(port + 1); // Try the next port (e.g., 3002)
      } else {
        console.error("Server error:", err);
      }
    });
};

// Start server with initial port and fallback
setTimeout(() => {
  startServer(PORT);
}, 2000); // 2-second delay

module.exports = app;