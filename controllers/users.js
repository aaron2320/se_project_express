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

  if (!email || !password) {
    res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required" });
    return; // ✅ fix: explicit return
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

  const sendUser = (user) =>
    res
      .status(201)
      .send(
        (({ password: hashedPassword, ...userWithoutPassword }) =>
          userWithoutPassword)(user.toObject())
      ); // ✅ fix: inline return

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
    )
    .then(sendUser)
    .catch(handleError);
};

// POST /signin
const login = (req, res) => {
  res.status(200).send({ message: "Login successful (placeholder)" });
};

// GET /users
const getUsers = (req, res) => {
  User.find({})
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
      res.status(SERVER_ERROR).send({ message: "Server error" });
    });
};

// GET /users/:id
const getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: "User not found" });
        return; // ✅ fix: explicit return
      }
      const { password, ...userWithoutPassword } = user.toObject();
      res.status(200).send(userWithoutPassword);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid user ID" });
      }
      res.status(SERVER_ERROR).send({ message: "Server error" });
    });
};

module.exports = {
  createUser,
  login,
  getUsers,
  getUserById,
};
