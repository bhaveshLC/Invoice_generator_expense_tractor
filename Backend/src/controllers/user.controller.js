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
const deleteUser = async (req, res) => {
  await userService.deleteUser(req.userId);
  res.status(204).json({
    status: "success",
    data: null,
  });
};
module.exports = { getSelf, updateUser, deleteUser };
