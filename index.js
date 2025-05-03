// Import database library and app
const mongoose = require("mongoose");
const app = require("./app");

// Get environment variables or default values
const { PORT = 3000, DB_URL = "mongodb://127.0.0.1:27017/wtwr_db" } =
  process.env;

// Connect to MongoDB and start the server
mongoose
  .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to DB");
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
