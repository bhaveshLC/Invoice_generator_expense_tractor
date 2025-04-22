const authService = require("../services/auth.service");
const handleRegister = async (req, res) => {
  const newUser = await authService.registerUser(req.body);
  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
};

const handleLogin = async (req, res) => {
  const token = await authService.loginUser(req.body.email, req.body.password);
  res.status(200).json({
    status: "success",
    data: {
      token,
    },
  });
};
const handleForgotPassword = async (req, res) => {
  const { email } = req.body;
  await authService.forgotPassword(email);
  res.status(200).json({
    status: "success",
    message: "OTP sent on your email",
  });
};
const handleVerifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const refreshToken = await authService.verifyOtp(email, otp);
  res.status(200).json({
    status: "success",
    data: refreshToken,
  });
};
const handleResetPassword = async (req, res) => {
  const { resetToken, password } = req.body;
  const user = await authService.resetPassword(resetToken, password);
  res.status(200).json({
    status: "success",
    data: "Password reset successfully",
  });
};
module.exports = {
  handleRegister,
  handleLogin,
  handleForgotPassword,
  handleVerifyOTP,
  handleResetPassword,
};
