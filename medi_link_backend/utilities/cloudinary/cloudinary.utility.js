const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
require("dotenv").config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage (default disk storage)
const storage = multer.diskStorage({});

// File filter: only allow images
const fileFilter = (req, file, cb) => {
  if (!file) return cb(new Error("No file uploaded."), false);

  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only image files (JPG, PNG, WEBP) are allowed."
      ),
      false
    );
  }
};

// Multer middleware: only profilePicture
const upload = multer({
  storage,
  fileFilter,
}).single("profilePicture");

// Middleware to ensure a file was uploaded
const checkUploadedFile = (req, res, next) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }
  next();
};

// Upload profile picture to Cloudinary
const uploadToCloudinary = async (file) => {
  try {
    const folder = "MediLink/profilePictures";
    const timestamp = Date.now();

    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      public_id: `${timestamp}`,
      resource_type: "image",
    });

    return { url: result.secure_url };
  } catch (error) {
    console.error("❌ Error uploading profile picture:", error);
    throw new Error("Error uploading profile picture");
  }
};

// Delete profile picture from Cloudinary
const deleteFromCloudinary = async (fileUrl) => {
  try {
    // Extract public ID
    const matches = fileUrl.match(/\/upload\/(?:v\d+\/)?([^?]+)/);
    if (!matches || matches.length < 2) return;

    let publicId = matches[1].replace(/\.[^.]+$/, "");

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
    if (result.result !== "ok") {
      console.error(`❌ Cloudinary deletion failed for: ${fileUrl}`);
    } else {
      console.log(`✅ Successfully deleted: ${fileUrl}`);
    }
  } catch (error) {
    console.error("❌ Error deleting profile picture:", error);
    throw new Error("Cloudinary deletion failed");
  }
};

module.exports = {
  upload,
  checkUploadedFile,
  uploadToCloudinary,
  deleteFromCloudinary,
};
