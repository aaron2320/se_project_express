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

// POST /signup
const createUser = (req, res) => bcrypt
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

// POST /users
const createUserPublic = (req, res) => {
  const { name, avatar } = req.body;

  if (!name || name.length < 2 || name.length > 30) {
    return res.status(BAD_REQUEST).send({ message: "Name must be between 2 and 30 characters" });
  }

  const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
  if (!avatar || !urlRegex.test(avatar)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid or missing avatar URL" });
  }

  const dummyEmail = `guest${Date.now()}@test.com`;
  const dummyPassword = "$2a$10$abcdefghijklmnopqrstuv1234567890ab";

  return User.create({ name, avatar, email: dummyEmail, password: dummyPassword })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
      const { password, ...userWithoutPassword } = user.toObject();
      return res.status(201).send({ ...userWithoutPassword, token });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      if (err.code === 11000) {
        return res.status(CONFLICT).send({ message: "User already exists" });
      }
      return res.status(SERVER_ERROR).send({ message: "Server error" });
    });
};

// GET /users
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
  createUserPublic,
  getUsers,
  getUserById,
};

