const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const NotFoundError = require("../utils/errors/NotFoundError");
const BadRequestError = require("../utils/errors/BadRequestError");
const ServerError = require("../utils/errors/ServerError");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");
const ConflictError = require("../utils/errors/ConflictError");
const {
  NOT_FOUND_ERROR_MESSAGE,
  BAD_REQUEST_ERROR_MESSAGE,
  SERVER_ERROR_MESSAGE,
  UNAUTHORIZED_ERROR_MESSAGE,
  CONFLICT_ERROR_MESSAGE,
} = require("../utils/errorMessages");

// POST /users
const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const { password: hashedPassword, ...userWithoutPassword } = user.toObject();
      res.status(201).send(userWithoutPassword);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError(err.message));
      } else if (err.code === 11000) {
        next(new ConflictError(CONFLICT_ERROR_MESSAGE));
      } else {
        next(new ServerError(SERVER_ERROR_MESSAGE));
      }
    });
};

// GET /users/me
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      const { password, ...userWithoutPassword } = user.toObject();
      res.status(200).send(userWithoutPassword);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError(NOT_FOUND_ERROR_MESSAGE));
      } else if (err.name === "CastError") {
        next(new BadRequestError(BAD_REQUEST_ERROR_MESSAGE));
      } else {
        next(new ServerError(SERVER_ERROR_MESSAGE));
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new BadRequestError("The password and email fields are required")
    );
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
        next(new UnauthorizedError(UNAUTHORIZED_ERROR_MESSAGE));
      } else {
        next(new ServerError(SERVER_ERROR_MESSAGE));
      }
    });
};

// PATCH /users/me — update profile
const updateUser = (req, res, next) => {
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
        next(new BadRequestError(err.message));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError(NOT_FOUND_ERROR_MESSAGE));
      } else {
        next(new ServerError(SERVER_ERROR_MESSAGE));
      }
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  login,
  updateUser,
};