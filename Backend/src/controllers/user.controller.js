const userService = require("../services/user.service");
const getSelf = async (req, res) => {
  const user = await userService.getSelf(req.userId);
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
};
const updateUser = async (req, res) => {
  const updatedUser = await userService.updateUser(req.userId, req.body);
  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
};

const uploadProfilePicture = async (req, res) => {
  const { path } = req.file;
  const result = await userService.uploadProfilePicture(req.userId, path);
  res.status(200).json({
    status: "success",
    data: {
      url: result,
    },
  });
};
const deleteUser = async (req, res) => {
  await userService.deleteUser(req.userId);
  res.status(204).json({
    status: "success",
    data: null,
  });
};
module.exports = { getSelf, updateUser, uploadProfilePicture, deleteUser };
