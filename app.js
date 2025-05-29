require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { errors } = require("celebrate");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const { login, createUser } = require("./controllers/users");
const { corsOptions } = require("./utils/config");

// Define NotFoundError locally to avoid import issues
const NOT_FOUND_ERROR_MESSAGE = "Resource not found";

const { PORT = 3001 } = process.env;
const app = express();

// CORS setup
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

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

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to WTWR!");
});

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.post("/signin", login);
app.post("/signup", createUser);

app.use("/users", require("./routes/users"));
app.use("/items", require("./routes/clothingItems"));

app.get("/test", (req, res) => {
  res.json({ message: "Test route working" });
});

// 404 Handler
app.use((req, res, next) => {
  console.log("404 Handler triggered for path:", req.path);
  const error = new Error(NOT_FOUND_ERROR_MESSAGE);
  error.statusCode = 404;
  error.name = "NotFoundError";
  next(error);
});

// Error logging and handling
app.use(errorLogger);
app.use(errors());

app.use(errorHandler);

// MongoDB connection using environment variable
mongoose
  .connect(process.env.MONGODB_URI)
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