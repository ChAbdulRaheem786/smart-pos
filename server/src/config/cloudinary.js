const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Generic uploader factory. `folder` groups images in Cloudinary
// (e.g. "pos-system/products", "pos-system/payment-proofs").
function makeUploader(folder) {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `pos-system/${folder}`,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [{ width: 1600, crop: "limit", quality: "auto" }],
    },
  });
  return multer({
    storage,
    limits: { fileSize: 8 * 1024 * 1024 }, // 8MB per file
  });
}

module.exports = { cloudinary, makeUploader };
