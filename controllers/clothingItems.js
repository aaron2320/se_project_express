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
const getItems = (req, res, next) => Item.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      next(new ServerError(SERVER_ERROR_MESSAGE));
    });

// POST /items
const createItem = (req, res, next) => {
  const { name, imageUrl, weather } = req.body;
  const owner = req.user._id;

  if (!owner) {
    return next(new ForbiddenError(AUTHENTICATION_FAIL_MESSAGE));
  }

  return Item.create({ name, imageUrl, weather, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError(err.message));
      } else {
        next(new ServerError(SERVER_ERROR_MESSAGE));
      }
    });
};

// GET /items/:itemId
const getItem = (req, res, next) => {
  const { itemId } = req.params;
  return Item.findById(itemId) // Ensure this return is present
    .orFail()
    .then((item) => res.status(200).send(item))
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

// DELETE /items/:itemId
const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!req.user._id) {
    return next(new ForbiddenError(AUTHENTICATION_FAIL_MESSAGE));
  }

  return Item.findById(itemId) // Ensure this return is present
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        return next(new ForbiddenError(FORBIDDEN_ERROR_MESSAGE));
      }
      return item.deleteOne().then(() => res.status(200).send({ message: "Item deleted successfully" }));
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

// PUT /items/:itemId/likes
const addLike = (req, res, next) => {
  const { itemId } = req.params;

  if (!req.user._id) {
    return next(new ForbiddenError(AUTHENTICATION_FAIL_MESSAGE));
  }

  return Item.findByIdAndUpdate( // Added return to ensure consistency
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        next(new NotFoundError(NOT_FOUND_ERROR_MESSAGE));
      } else {
        res.send(item);
      }
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        next(new BadRequestError(BAD_REQUEST_ERROR_MESSAGE));
      } else {
        next(new ServerError(SERVER_ERROR_MESSAGE));
      }
    });
};

// DELETE /items/:itemId/likes
const removeLike = (req, res, next) => {
  const { itemId } = req.params;

  if (!req.user._id) {
    return next(new ForbiddenError(AUTHENTICATION_FAIL_MESSAGE));
  }

  return Item.findByIdAndUpdate( // Added return to ensure consistency
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        next(new NotFoundError(NOT_FOUND_ERROR_MESSAGE));
      } else {
        res.send(item);
      }
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        next(new BadRequestError(BAD_REQUEST_ERROR_MESSAGE));
      } else {
        next(new ServerError(SERVER_ERROR_MESSAGE));
      }
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
