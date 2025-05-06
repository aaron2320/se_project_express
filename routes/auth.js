const router = require("express").Router();
const { login, createUser } = require("../controllers/users");

router.post("/signup", createUser);
router.post("/signin", login);

module.exports = router;