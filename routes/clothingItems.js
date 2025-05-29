// routes/clothingItems.js
const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const auth = require("../middlewares/auth");
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

// POST - Create a new clothing item
router.post(
  "/",
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      weather: Joi.string().required().valid("hot", "warm", "cold"),
      imageUrl: Joi.string().uri().required(),
    }),
  }),
  createItem
);

// DELETE a clothing item by ID
router.delete("/:itemId", auth, deleteItem);

// Like an item
router.put("/:itemId/likes", auth, addLike);

// Remove like from an item
router.delete("/:itemId/likes", auth, removeLike);

module.exports = router;