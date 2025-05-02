const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  FORBIDDEN,
} = require("../utils/errors");

const ClothingItem = require("../models/clothingItem");

// GET /items
const getItems = (req, res) => {
  return ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

// (rest of file unchanged)

module.exports = {
  getItems,
  createItem,
  getItem,
  addLike,
  removeLike,
  deleteItem,
};
