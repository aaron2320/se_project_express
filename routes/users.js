const express = require("express");
const User = require("../models/user");

const router = express.Router();

// Create user (private)
router.post("/", (req, res) => {
  const { name, avatar } = req.body;

  if (!name || name.length < 2 || name.length > 30) {
    return res
      .status(400)
      .json({ message: "Name must be between 2 and 30 characters" });
  }

  if (!avatar || typeof avatar !== "string") {
    return res
      .status(400)
      .json({ message: "Avatar must be a valid URL string" });
  }

  return User.create({ name, avatar })
    .then((user) => {
      res
        .status(201)
        .json({ _id: user._id, name: user.name, avatar: user.avatar });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Internal server error", error: err.message });
    });
});

// GET all users
router.get("/", (req, res) => {
  return User.find({})
    .then((users) => res.json(users))
    .catch((err) =>
      res
        .status(500)
        .json({ message: "Internal server error", error: err.message })
    );
});

// GET user by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  return User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json(user);
    })
    .catch((err) =>
      res
        .status(500)
        .json({ message: "Internal server error", error: err.message })
    );
});

module.exports = router;
