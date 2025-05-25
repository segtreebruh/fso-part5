const logger = require("./logger");
const jwt = require("jsonwebtoken");

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (request, response) => {
  return response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.error("ErrorHandler intercepted: ", error);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    return response
      .status(400)
      .json({ error: "expected `username` to be unique" });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "invalid token" });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({
      error: "token expired",
    });
  }

  next(error);
};

const getTokenFromRequests = (request, response, next) => {
  // authorization header
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Authorization
  // will show up in devtools: Network/Headers
  const authorization = request.get("authorization");
  console.log("getTokenFromRequest: ", authorization);

  if (authorization && authorization.startsWith("Bearer ")) {
    // will not work
    // authorization.replace("Bearer ", "");

    // authorization[7:]
    request.token = authorization.substring(7);
  }

  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  getTokenFromRequests,
  errorHandler,
};
