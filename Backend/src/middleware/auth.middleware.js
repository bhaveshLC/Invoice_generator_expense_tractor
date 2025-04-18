const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { AppError } = require("../utils/errorHandler");
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    throw new AppError(403, "Token is required");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
    if (err) {
      throw new AppError(401, "Invalid token");
    }
    req.userId = decode._id;
    next();
  });
};

module.exports = authMiddleware;
