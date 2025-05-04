const router = require("express").Router();
const { createUser, getUsers, getUserById } = require("../controllers/users");

// Public routes
router.post("/", createUser); //

// Private routes
router.get("/", getUsers);
router.get("/:id", getUserById);

module.exports = router;
