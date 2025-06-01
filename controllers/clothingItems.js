console.log("Loading controllers/clothingItems.js - Updated Version 2025-05-31");

const Item = require("../models/clothingItem");

const NotFoundError = require("../utils/errors/NotFoundError");
const BadRequestError = require("../utils/errors/BadRequestError");
const ServerError = require("../utils/errors/ServerError");
const ForbiddenError = require("../utils/errors/ForbiddenError");
const {
  NOT_FOUND_ERROR_MESSAGE,
  BAD_REQUEST_ERROR_MESSAGE,
  SERVER_ERROR_MESSAGE,
  FORBIDDEN_ERROR_MESSAGE,
  AUTHENTICATION_FAIL_MESSAGE,
} = require("../utils/errorMessages");

// GET /items
const getItems = (req, res) => {
  Item.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      res
        .status(new ServerError(SERVER_ERROR_MESSAGE).statusCode)
        .send({ message: SERVER_ERROR_MESSAGE });
    });
};

// POST /items
const createItem = (req, res) => {
  const { name, imageUrl, weather } = req.body;
  const owner = req.user._id;

  if (!owner) {
    return res
      .status(new ForbiddenError(AUTHENTICATION_FAIL_MESSAGE).statusCode)
      .send({ message: AUTHENTICATION_FAIL_MESSAGE });
  }

  return Item.create({ name, imageUrl, weather, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(new BadRequestError(BAD_REQUEST_ERROR_MESSAGE).statusCode)
          .send({ message: err.message });
      }
      return res
        .status(new ServerError(SERVER_ERROR_MESSAGE).statusCode)
        .send({ message: SERVER_ERROR_MESSAGE });
    });
};

// GET /items/:itemId
const getItem = (req, res) => {
  const { itemId } = req.params;
  return Item.findById(itemId)
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(new NotFoundError(NOT_FOUND_ERROR_MESSAGE).statusCode)
          .send({ message: NOT_FOUND_ERROR_MESSAGE });
      }
      if (err.name === "CastError") {
        return res
          .status(new BadRequestError(BAD_REQUEST_ERROR_MESSAGE).statusCode)
          .send({ message: BAD_REQUEST_ERROR_MESSAGE });
      }
      return res
        .status(new ServerError(SERVER_ERROR_MESSAGE).statusCode)
        .send({ message: SERVER_ERROR_MESSAGE });
    });
};

// DELETE /items/:itemId
const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!req.user._id) {
    return res
      .status(new ForbiddenError(AUTHENTICATION_FAIL_MESSAGE).statusCode)
      .send({ message: AUTHENTICATION_FAIL_MESSAGE });
  }

  return Item.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        return res
          .status(new ForbiddenError(FORBIDDEN_ERROR_MESSAGE).statusCode)
          .send({ message: FORBIDDEN_ERROR_MESSAGE });
      }
      return item.deleteOne().then(() => res.status(200).send({ message: "Item deleted successfully" })); // Simplified arrow function
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError(NOT_FOUND_ERROR_MESSAGE));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError(BAD_REQUEST_ERROR_MESSAGE));
      }
      return next(new ServerError(SERVER_ERROR_MESSAGE));
    });
};

// PUT /items/:itemId/likes
const addLike = (req, res, next) => {
  const { itemId } = req.params;

  if (!req.user._id) {
    return res
      .status(new ForbiddenError(AUTHENTICATION_FAIL_MESSAGE).statusCode)
      .send({ message: AUTHENTICATION_FAIL_MESSAGE });
  }

  return Item.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return next(new NotFoundError(NOT_FOUND_ERROR_MESSAGE));
      }
      return res.send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new BadRequestError(BAD_REQUEST_ERROR_MESSAGE));
      }
      return next(new ServerError(SERVER_ERROR_MESSAGE));
    });
};

// DELETE /items/:itemId/likes
const removeLike = (req, res, next) => {
  const { itemId } = req.params;

  if (!req.user._id) {
    return res
      .status(new ForbiddenError(AUTHENTICATION_FAIL_MESSAGE).statusCode)
      .send({ message: AUTHENTICATION_FAIL_MESSAGE });
  }

  return Item.findByIdAndUpdate( // Explicit return to fix consistent-return
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return next(new NotFoundError(NOT_FOUND_ERROR_MESSAGE));
      }
      return res.send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new BadRequestError(BAD_REQUEST_ERROR_MESSAGE));
      }
      return next(new ServerError(SERVER_ERROR_MESSAGE));
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