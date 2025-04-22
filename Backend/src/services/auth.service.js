const crypto = require("crypto");
const Otp = require("../models/otp.model");
const User = require("../models/user.model");
const sendEmail = require("../utils/emailHandler");
const { AppError } = require("../utils/errorHandler");
async function registerUser(user) {
  const existingUser = await User.findOne({ email: user.email });
  if (existingUser) {
    throw new AppError(409, "User already exists");
  }
  const newUser = await User.create(user);
  return newUser;
}

async function loginUser(email, password) {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError(403, "Invalid credentials");
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError(403, "Invalid credentials");
  }
  return user.generateAuthToken();
}

async function forgotPassword(email) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  const otp = Math.floor(100000 + Math.random() * 900000);
  await sendEmail({
    to: user.email,
    subject: "Password Reset OTP",
    text: `Your OTP is ${otp}`,
  });
  const otpData = await Otp.create({
    user: user._id,
    otp,
  });
  return;
}
async function verifyOtp(email, otp) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  const otpData = await Otp.findOne({ user: user._id, otp });
  if (!otpData) {
    throw new AppError(403, "Invalid OTP");
  }
  const currentTime = new Date();
  const otpTime = new Date(otpData.createdAt);
  const timeDiff = Math.abs(currentTime - otpTime);
  const diffMinutes = Math.floor(timeDiff / (1000 * 60));
  if (diffMinutes > 10) {
    throw new AppError(403, "OTP expired");
  }
  await Otp.deleteOne({ user: user._id, otp });
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetToken = resetToken;
  user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
  await user.save();
  return resetToken;
}
async function resetPassword(resetToken, newPassword) {
  const user = await User.findOne({ resetToken }).select("+password");
  if (!user) {
    throw new AppError(404, "User not found");
  }
  user.password = newPassword;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();
  return user;
}
module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
};
