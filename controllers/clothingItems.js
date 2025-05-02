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

const createItem = (req, res) => {
  /* your implementation */
};
const getItem = (req, res) => {
  /* your implementation */
};
const addLike = (req, res) => {
  /* your implementation */
};
const removeLike = (req, res) => {
  /* your implementation */
};
const deleteItem = (req, res) => {
  /* your implementation */
};

module.exports = {
  getItems,
  createItem,
  getItem,
  addLike,
  removeLike,
  deleteItem,
};
