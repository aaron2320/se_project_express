const mongoose = require("mongoose");

const filmSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  genre: {
    type: String,
    required: true,
    enum: ["comedy", "drama", "action", "thriller", "documentary"],
  },
  director: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "director",
    required: true,
  },
});

module.exports = mongoose.model("film", filmSchema);
