const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  if (!file) {
    cb(new Error("No file uploaded."), false);
    return;
  }
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only image files are allowed."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
}).single("profilePicture");

const uploadToCloudinary = async (file) => {
  const baseFolder = "MediLink";

  try {
    const folder = `${baseFolder}/profilePictures`;
    const timestamp = Date.now();
    const globalFileName = `${timestamp}`;

    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      public_id: globalFileName,
      resource_type: "image",
    });
    return { url: result.secure_url };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Error uploading to Cloudinary");
  }
};

module.exports = {
  upload,
  uploadToCloudinary,
};
