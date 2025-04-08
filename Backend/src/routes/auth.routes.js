const {
  handleRegister,
  handleLogin,
} = require("../controllers/auth.controller");
const asyncHandler = require("../middleware/asyncHandler");

const router = require("express").Router();

router
  .post("/register", asyncHandler(handleRegister))
  .post("/login", asyncHandler(handleLogin));

module.exports = { authRoute: router };
