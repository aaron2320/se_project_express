const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  CONFLICT,
} = require("../utils/errors");

const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const { password: hashedPassword, ...userWithoutPassword } = user.toObject();
      return res.status(201).send(userWithoutPassword);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      if (err.code === 11000) {
        return res.status(CONFLICT).send({ message: "User already exists" });
      }
      return res.status(SERVER_ERROR).send({ message: "An error occurred on the server" });
    });
};

const getUsers = (req, res) => User.find({})
  .then((users) => {
    const cleanedUsers = users.map((u) => {
      const { password, ...rest } = u.toObject();
      return rest;
    });
    return res.status(200).send(cleanedUsers);
  })
  .catch((err) => {
    console.error(err);
    return res.status(SERVER_ERROR).send({ message: "Server error" });
  });

const getUserById = (req, res) => {
  const { id } = req.params;
  return User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user.toObject();
      return res.status(200).send(userWithoutPassword);
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


