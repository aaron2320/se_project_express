const router = require("express").Router();
const {
  createUser,
  getUsers,
  getUserById,
  createUserPublic,
} = require("../controllers/users");

router.post("/signup", createUser);
router.post("/", createUserPublic);
router.get("/", getUsers);
router.get("/:id", getUserById);

module.exports = router;
