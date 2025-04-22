const User = require("../models/user.model");
const { AppError } = require("../utils/errorHandler");
const { uploadToCloudinary } = require("../utils/uploadToCloudinary");

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
async function uploadProfilePicture(userId, filePath) {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, "User not found");
  }
  let result;
  try {
    result = await uploadToCloudinary(filePath);
  } catch (error) {
    console.log(error);
  }
  user.profileLogo = result.url;
  await user.save();
  return user.profileLogo;
}
async function deleteUser(userId) {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new AppError(404, "User not found");
  }
  return user;
}

module.exports = {
  getSelf,
  updateUser,
  uploadProfilePicture,
  deleteUser,
};
