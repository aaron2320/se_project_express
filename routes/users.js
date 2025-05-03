const router = require("express").Router();
const {
  createUser,
  getUsers,
  getUserById,
  createUserPublic,
} = require("../controllers/users");

// Inject req.user before any route handler
router.use((req, res, next) => {
  req.user = { _id: "5d8b8592978f8bd833ca8133" };
  next();
});

router.post("/signup", createUser);
router.post("/", createUserPublic);
router.get("/", getUsers);
router.get("/:id", getUserById);

module.exports = router;
