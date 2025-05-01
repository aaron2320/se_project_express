const router = require("express").Router();
const {
  getCurrentUser,
  updateUser,
  getUsers,
  getUserById,
  createUserPublic,
} = require("../controllers/users");
const auth = require("../middlewares/auth");

// Public route used in some tests (only name + avatar)
router.post("/", createUserPublic);

// Protected routes
router.get("/", auth, getUsers);
router.get("/:id", auth, getUserById);
router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateUser);

module.exports = router;
