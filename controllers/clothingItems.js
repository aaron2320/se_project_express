const { SERVER_ERROR } = require("../utils/errors");
const ClothingItem = require("../models/clothingItem");

const getItems = (req, res) =>
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });

const createItem = (req, res) =>
  res.status(501).send({ message: "Not implemented" });
const getItem = (req, res) =>
  res.status(501).send({ message: "Not implemented" });
const addLike = (req, res) =>
  res.status(501).send({ message: "Not implemented" });
const removeLike = (req, res) =>
  res.status(501).send({ message: "Not implemented" });
const deleteItem = (req, res) =>
  res.status(501).send({ message: "Not implemented" });

module.exports = {
  getItems,
  createItem,
  getItem,
  addLike,
  removeLike,
  deleteItem,
};
