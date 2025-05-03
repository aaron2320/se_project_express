const router = require("express").Router();
const {
  createUser,
  login,
  getUsers,
  getUserById,
} = require("../controllers/users");

// Public routes
router.post("/", createUser); // <--- this is what the test expects
router.post("/signin", login);

// Private routes
router.get("/", getUsers);
router.get("/:id", getUserById);

module.exports = router;
