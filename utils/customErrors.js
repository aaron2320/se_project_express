class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = 400;
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = 401;
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = "ForbiddenError";
    this.statusCode = 403;
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConflictError";
    this.statusCode = 409;
  }
}

class ServerError extends Error {
  constructor(message) {
    super(message);
    this.name = "ServerError";
    this.statusCode = 500;
  }
}

const NOT_FOUND_ERROR_MESSAGE = "Resource not found";
const BAD_REQUEST_ERROR_MESSAGE = "Invalid request data";
const UNAUTHORIZED_ERROR_MESSAGE = "Authentication required";
const FORBIDDEN_ERROR_MESSAGE = "Access denied";
const CONFLICT_ERROR_MESSAGE = "Resource conflict";
const SERVER_ERROR_MESSAGE = "An error occurred on the server";
const AUTHENTICATION_FAIL_MESSAGE = "Authentication failed";

module.exports = {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  ServerError,
  NOT_FOUND_ERROR_MESSAGE,
  BAD_REQUEST_ERROR_MESSAGE,
  UNAUTHORIZED_ERROR_MESSAGE,
  FORBIDDEN_ERROR_MESSAGE,
  CONFLICT_ERROR_MESSAGE,
  SERVER_ERROR_MESSAGE,
  AUTHENTICATION_FAIL_MESSAGE,
};