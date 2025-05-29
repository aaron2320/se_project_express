const Item = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  FORBIDDEN,
} = require("../utils/errors");

// GET /items
const getItems = (req, res) => {
  Item.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .send({ message: "An error occurred on the server" });
    });
};

// POST /items
const createItem = (req, res) => {
  const { name, imageUrl, weather } = req.body;
  const owner = req.user._id;

  if (!owner) {
    return res.status(401).send({ message: "Authentication required" });
  }

  Item.create({ name, imageUrl, weather, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res
        .status(500)
        .send({ message: "An error occurred on the server" });
    });
};

// GET /items/:itemId
const getItem = (req, res) => {
  const { itemId } = req.params;
  Item.findById(itemId)
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid item ID" });
      }
      return res
        .status(500)
        .send({ message: "An error occurred on the server" });
    });
};

// DELETE /items/:itemId
const deleteItem = (req, res) => {
  const { itemId } = req.params;

  if (!req.user._id) {
    return res.status(401).send({ message: "Authentication required" });
  }

  Item.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        return res.status(403).send({
          message: "You do not have permission to delete this item",
        });
      }
      return item.deleteOne().then(() => {
        res.status(200).send({ message: "Item deleted successfully" });
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        const error = new Error("Item not found");
        error.statusCode = 404;
        throw error;
      }
      if (err.name === "CastError") {
        const error = new Error("Invalid item ID");
        error.statusCode = 400;
        throw error;
      }
      const error = new Error("An error occurred on the server");
      error.statusCode = 500;
      throw error;
    })
    .catch((err) => {
      req.error = err;
      next(err);
    });
};

// PUT /items/:itemId/likes
const addLike = (req, res) => {
  const { itemId } = req.params;

  if (!req.user._id) {
    return res.status(401).send({ message: "Authentication required" });
  }

  Item.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        const error = new Error("Item not found");
        error.statusCode = 404;
        throw error;
      }
      return res.send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.statusCode) {
        throw err;
      }
      if (err.name === "CastError") {
        const error = new Error("Invalid ID format");
        error.statusCode = 400;
        throw error;
      }
      const error = new Error("Error updating likes");
      error.statusCode = 500;
      throw error;
    })
    .catch((err) => {
      req.error = err;
      next(err);
    });
};

// DELETE /items/:itemId/likes
const removeLike = (req, res) => {
  const { itemId } = req.params;

  if (!req.user._id) {
    return res.status(401).send({ message: "Authentication required" });
  }

  Item.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        const error = new Error("Item not found");
        error.statusCode = 404;
        throw error;
      }
      return res.send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.statusCode) {
        throw err;
      }
      if (err.name === "CastError") {
        const error = new Error("Invalid ID format");
        error.statusCode = 400;
        throw error;
      }
      const error = new Error("Error updating likes");
      error.statusCode = 500;
      throw error;
    })
    .catch((err) => {
      req.error = err;
      next(err);
    });
};

module.exports = {
  getItems,
  createItem,
  getItem,
  addLike,
  removeLike,
  deleteItem,
};