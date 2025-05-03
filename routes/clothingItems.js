const router = require("express").Router();
const {
  getItems,
  createItem,
  getItem,
  deleteItem,
  addLike,
  removeLike,
} = require("../controllers/clothingItems");

// Inject req.user before any route handler
router.use((req, res, next) => {
  req.user = { _id: "5d8b8592978f8bd833ca8133" };
  next();
});

router.get("/", getItems);
router.get("/:itemId", getItem);
router.delete("/:itemId", deleteItem);
router.post("/", createItem);
router.put("/:itemId/likes", addLike);
router.delete("/:itemId/likes", removeLike);

module.exports = router;
