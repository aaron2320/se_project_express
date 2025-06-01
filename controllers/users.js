const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Import error classes
const BadRequestError = require("../utils/errors/BadRequestError");
const NotFoundError = require("../utils/errors/NotFoundError");
const ServerError = require("../utils/errors/ServerError");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");
const ConflictError = require("../utils/errors/ConflictError");

const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

// POST /users
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const { password: hashedPassword, ...userWithoutPassword } =
        user.toObject();
      res.status(201).send(userWithoutPassword);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(new BadRequestError().statusCode).send({ message: err.message });
      }
      if (err.code === 11000) {
        return res.status(new ConflictError().statusCode).send({ message: "User already exists" });
      }
      return res
        .status(new ServerError().statusCode)
        .send({ message: "An error occurred on the server" });
    });
};

// GET /users/me
const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      const { password, ...userWithoutPassword } = user.toObject();
      res.status(200).send(userWithoutPassword);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(new NotFoundError().statusCode).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res.status(new BadRequestError().statusCode).send({ message: "Invalid user ID" });
      }
      return res
        .status(new ServerError().statusCode)
        .send({ message: "An error occurred on the server" });
    });
};

// POST /signin
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(new BadRequestError().statusCode).send({
      message: "The password and email fields are required",
    });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        return res
          .status(new UnauthorizedError().statusCode)
          .send({ message: "Incorrect email or password" });
      }
      return res
        .status(new ServerError().statusCode)
        .send({ message: "An error occurred on the server" });
    });
};

// PATCH /users/me — update profile
const updateUser = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => {
      const { password, ...userWithoutPassword } = user.toObject();
      res.status(200).send(userWithoutPassword);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(new BadRequestError().statusCode).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(new NotFoundError().statusCode).send({ message: "User not found" });
      }
      return res
        .status(new ServerError().statusCode)
        .send({ message: "An error occurred on the server" });
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  login,
  updateUser,
};