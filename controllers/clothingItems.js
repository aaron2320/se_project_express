const { SERVER_ERROR } = require("../utils/errors");
const ClothingItem = require("../models/clothingItem");

// GET /items
const getItems = (req, res) =>
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });

// TEMPORARILY COMMENT UNUSED FUNCTIONS to pass ESLint:

// const createItem = (req, res) => {};
// const getItem = (req, res) => {};
// const addLike = (req, res) => {};
// const removeLike = (req, res) => {};
// const deleteItem = (req, res) => {};

module.exports = {
  getItems,
  // createItem,
  // getItem,
  // addLike,
  // removeLike,
  // deleteItem,
};
