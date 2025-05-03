const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

// GET /items - Retrieve all clothing items
const getItems = async (req, res) => {
  try {
    const items = await ClothingItem.find().populate("owner").populate("likes");
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res
      .status(SERVER_ERROR)
      .json({ message: "An error occurred on the server" });
  }
};

// GET /items/:itemId - Retrieve a specific clothing item by ID
const getItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
    }
    const item = await ClothingItem.findById(itemId)
      .populate("owner")
      .populate("likes");
    if (!item) {
      return res.status(NOT_FOUND).json({ message: "Item not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    console.error("Error fetching item:", error);
    res
      .status(SERVER_ERROR)
      .json({ message: "An error occurred on the server" });
  }
};

// POST /items - Create a new clothing item
const createItem = async (req, res) => {
  try {
    const { name, weather, imageUrl } = req.body;
    const owner = req.user._id; // From temporary auth middleware
    const item = new ClothingItem({ name, weather, imageUrl, owner });
    const savedItem = await item.save();
    const populatedItem = await ClothingItem.findById(savedItem._id)
      .populate("owner")
      .populate("likes");
    res.status(201).json(populatedItem);
  } catch (error) {
    console.error("Error creating item:", error);
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");
      return res.status(BAD_REQUEST).json({ message });
    }
    res
      .status(SERVER_ERROR)
      .json({ message: "An error occurred on the server" });
  }
};

// DELETE /items/:itemId - Delete a clothing item by ID
const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
    }
    const item = await ClothingItem.findByIdAndDelete(itemId);
    if (!item) {
      return res.status(NOT_FOUND).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Item deleted" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res
      .status(SERVER_ERROR)
      .json({ message: "An error occurred on the server" });
  }
};

// PUT /items/:itemId/likes - Like a clothing item
const addLike = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id; // From temporary auth middleware
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
    }
    const item = await ClothingItem.findById(itemId);
    if (!item) {
      return res.status(NOT_FOUND).json({ message: "Item not found" });
    }
    if (!item.likes.includes(userId)) {
      item.likes.push(userId);
      await item.save();
    }
    const updatedItem = await ClothingItem.findById(itemId)
      .populate("owner")
      .populate("likes");
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error("Error liking item:", error);
    res
      .status(SERVER_ERROR)
      .json({ message: "An error occurred on the server" });
  }
};

// DELETE /items/:itemId/likes - Unlike a clothing item
const removeLike = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id; // From temporary auth middleware
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
    }
    const item = await ClothingItem.findById(itemId);
    if (!item) {
      return res.status(NOT_FOUND).json({ message: "Item not found" });
    }
    item.likes = item.likes.filter((id) => id.toString() !== userId.toString());
    await item.save();
    const updatedItem = await ClothingItem.findById(itemId)
      .populate("owner")
      .populate("likes");
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error("Error unliking item:", error);
    res
      .status(SERVER_ERROR)
      .json({ message: "An error occurred on the server" });
  }
};

module.exports = {
  getItems,
  getItem,
  createItem,
  deleteItem,
  addLike,
  removeLike,
};
