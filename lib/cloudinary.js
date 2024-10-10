const cloudinary = require("cloudinary").v2;

const uploadImageToCloudinary = async (imagePath, options = {}) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const {
      asset_id,
      public_id,
      width,
      height,
      format,
      resource_type,
      bytes,
      url,
      asset_folder,
    } = await cloudinary.uploader.upload(imagePath, options);
    return {
      asset_id,
      public_id,
      width,
      height,
      format,
      resource_type,
      bytes,
      url,
      asset_folder,
    };
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
  }
};

module.exports = uploadImageToCloudinary;
