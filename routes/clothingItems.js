const router = require("express").Router();

const {
  getItems,
  createItem,
  getItem,
  deleteItem,
  addLike,
  removeLike,
} = require("../controllers/clothingItems");

router.get("/", getItems);
router.get("/:itemId", getItem);
router.post("/", createItem);
router.delete("/:itemId", deleteItem);
router.put("/:itemId/likes", addLike);
router.delete("/:itemId/likes", removeLike);

module.exports = router;
