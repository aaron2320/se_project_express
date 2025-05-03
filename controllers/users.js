const bcrypt = require("bcryptjs");
const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  CONFLICT,
} = require("../utils/errors");

// POST /signup
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  const createUserData = { name, avatar };

  if (email) {
    createUserData.email = email;
  }

  const handleError = (err) => {
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: err.message });
    }
    if (err.code === 11000) {
      return res.status(CONFLICT).send({ message: "User already exists" });
    }
    return res
      .status(SERVER_ERROR)
      .send({ message: "An error occurred on the server" });
  };

  const sendUser = (user) => {
    const { password: hashedPassword, ...userWithoutPassword } =
      user.toObject();
    return res.status(201).send(userWithoutPassword);
  };

  if (password) {
    return bcrypt
      .hash(password, 10)
      .then((hash) => {
        createUserData.password = hash;
        return User.create(createUserData);
      })
      .then(sendUser)
      .catch(handleError);
  }

  return User.create(createUserData).then(sendUser).catch(handleError);
};

// POST /signin
const login = (req, res) =>
  res.status(200).send({ message: "Login successful (placeholder)" });

// GET /users
const getUsers = (req, res) => {
  return User.find({})
    .then((users) =>
      res.status(200).send(
        users.map((u) => {
          const { password, ...rest } = u.toObject();
          return rest;
        })
      )
    )
    .catch((err) => {
      console.error(err);
      return res.status(SERVER_ERROR).send({ message: "Server error" });
    });
};

// GET /users/:id
const getUserById = (req, res) => {
  return User.findById(req.params.id)
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
};

module.exports = {
  createUser,
  login,
  getUsers,
  getUserById,
};
