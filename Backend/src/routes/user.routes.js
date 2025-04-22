const router = require("express").Router();
const multer = require("multer");
const {
  getSelf,
  updateUser,
  deleteUser,
  uploadProfilePicture,
} = require("../controllers/user.controller");
const asyncHandler = require("../middleware/asyncHandler");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
router
  .get("/self", asyncHandler(getSelf))
  .put("/self", asyncHandler(updateUser))
  .put(
    "/self/profile-picture",
    upload.single("profile"),
    asyncHandler(uploadProfilePicture)
  )
  .delete("/self", asyncHandler(deleteUser));

module.exports = { userRoute: router };
