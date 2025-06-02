const errorHandler = (err, req, res) => {
  // console.error(err);

  if (err.statusCode) {
    return res
      .status(err.statusCode)
      .send({ message: err.message, name: err.name });
  }
  return res.status(500).send({ message: "An error occurred on the server" });
};

module.exports = errorHandler;