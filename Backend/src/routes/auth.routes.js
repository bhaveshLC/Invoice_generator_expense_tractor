const {
  handleRegister,
  handleLogin,
  handleForgotPassword,
  handleVerifyOTP,
  handleResetPassword,
} = require("../controllers/auth.controller");
const asyncHandler = require("../middleware/asyncHandler");

const router = require("express").Router();

router
  .post("/register", asyncHandler(handleRegister))
  .post("/login", asyncHandler(handleLogin))
  .post("/forgot-password", asyncHandler(handleForgotPassword))
  .post("/verify-otp", asyncHandler(handleVerifyOTP))
  .post("/reset-password", asyncHandler(handleResetPassword));

module.exports = { authRoute: router };
