const cloudinary = require("cloudinary").v2;

const uploadImageToCloudinary = async (imagePath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const uploadResult = await cloudinary.uploader.upload(imagePath);
    return uploadResult;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
  }
};

module.exports = uploadImageToCloudinary;
