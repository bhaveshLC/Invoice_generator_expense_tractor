const User = require("../models/user.model");
const { AppError } = require("../utils/errorHandler");

async function getSelf(userId) {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new AppError(404, "User not found");
  }
  return user;
}

async function updateUser(userId, updatedUser) {
  const user = await User.findByIdAndUpdate(userId, updatedUser, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  return user;
}

async function deleteUser(userId) {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new AppError(404, "User not found");
  }
  return user;
}

module.exports = { getSelf, updateUser, deleteUser };
