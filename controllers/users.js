const User = require("../models/user");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

// POST /users
const createUser = (req, res) => {
  const { name, avatar } = req.body;

  const handleError = (err) => {
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: err.message });
    }
    return res
      .status(SERVER_ERROR)
      .send({ message: "An error occurred on the server" });
  };

  return User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch(handleError);
};

// GET /users
const getUsers = (req, res) =>
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(SERVER_ERROR).send({ message: "Server error" });
    });

// GET /users/:id
const getUserById = (req, res) =>
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid user ID" });
      }
      return res.status(SERVER_ERROR).send({ message: "Server error" });
    });

module.exports = {
  createUser,
  getUsers,
  getUserById,
};
