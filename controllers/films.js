const Film = require("../models/film");

module.exports.getFilms = (req, res) => {
  Film.find({})
    .populate("director") // Replaces ObjectId with the full director document
    .then((films) => res.send({ data: films }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createFilm = (req, res) => {
  const { title, genre, directorId } = req.body;

  Film.create({ title, genre, director: directorId })
    .then((film) => res.send({ data: film }))
    .catch((err) => res.status(500).send({ message: err.message }));
};
