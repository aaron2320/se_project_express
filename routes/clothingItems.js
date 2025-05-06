const router = require("express").Router();

const {
  getItems,
  createItem,
  getItem,
  deleteItem,
  addLike,
  removeLike,
} = require("../controllers/clothingItems");

// GET all clothing items
router.get("/", getItems);

// GET single clothing item by ID
router.get("/:itemId", getItem);

// DELETE a clothing item by ID
router.delete("/:itemId", deleteItem);

// POST - Create a new clothing item
router.post("/", createItem);
router.put("/:itemId/likes", addLike);
router.delete("/:itemId/likes", removeLike);

module.exports = router;
