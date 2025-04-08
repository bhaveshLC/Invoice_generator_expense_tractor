const router = require("express").Router();
const {
  getSelf,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");
const asyncHandler = require("../middleware/asyncHandler");

router
  .get("/self", asyncHandler(getSelf))
  .put("/self", asyncHandler(updateUser))
  .delete("/self", asyncHandler(deleteUser));

module.exports = { userRoute: router };
