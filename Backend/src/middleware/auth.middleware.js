const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET);
  if (!decode) {
    return res.status(401).json({ message: "Token is invalid" });
  }
  req.userId = decode._id;
  next();
};

module.exports = authMiddleware;
