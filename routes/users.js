const express = require("express");
const User = require("../models/user");

const router = express.Router();

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.json(users))
    .catch((err) =>
      res
        .status(500)
        .json({ message: "Internal server error", error: err.message })
    );
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).json(user))
    .catch((err) =>
      res.status(400).json({ message: "Bad request", error: err.message })
    );
};

router.get("/users", getUsers);
router.post("/users", createUser);

module.exports = router;
