const router = require("express").Router();
const { getFilms, createFilm } = require("../controllers/films");

// Get all films - mapped to the getFilms handler
router.get("/", getFilms);

// Create a new film - mapped to the createFilm handler
router.post("/", createFilm);

module.exports = router;
