const errorHandler = (err, req, res, next) => {
  // console.error(err);

  if (err.statusCode) {
    res
      .status(err.statusCode)
      .send({ message: err.message, name: err.name });
  } else {
    res.status(500).send({ message: "An error occurred on the server" });
  }
   next();
};

module.exports = errorHandler;
