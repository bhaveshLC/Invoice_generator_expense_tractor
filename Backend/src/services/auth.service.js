const User = require("../models/user.model");
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
module.exports = { registerUser, loginUser };
