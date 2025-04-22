const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(localFilePath) {
  const mainFolderName = "uploads";
  const filePathOnCloudinary = `${mainFolderName}/${path.basename(
    localFilePath
  )}`;

  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      public_id: filePathOnCloudinary,
    });
    fs.unlinkSync(localFilePath);
    return {
      message: "Success",
      url: result.secure_url,
    };
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.log(error);

    return {
      message: "Fail",
    };
  }
}

module.exports = { uploadToCloudinary };
