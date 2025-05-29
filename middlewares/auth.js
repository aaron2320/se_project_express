const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const {
  AUTHENTICATION_FAIL_MESSAGE,
  UnauthorizedError,
} = require("../utils/errors");

const auth = (req, res, next) => {
  console.log("Auth middleware - Starting for path:", req.path);
  console.log("Auth middleware - Headers:", req.headers);
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    console.log("Auth middleware - No valid Bearer token");
    return next(new UnauthorizedError(AUTHENTICATION_FAIL_MESSAGE));
  }

  const token = authorization.replace("Bearer ", "");
  console.log("Auth middleware - Extracted token:", token);

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    console.log("Auth middleware - Decoded payload:", payload);
    req.user = payload; // Should set {_id, iat, exp}
    console.log("Auth middleware - req.user set:", req.user);
    return next();
  } catch (err) {
    console.log("Auth middleware - Token verification failed:", err.message);
    return next(new UnauthorizedError(AUTHENTICATION_FAIL_MESSAGE));
  }
};

module.exports = auth;