require('dotenv').config();
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImageToCloudinary = async (base64, preset) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(base64, {
      upload_preset: preset,
    });

    return uploadResponse;
  } catch (error) {
    console.error(error);
  }
};

const deleteImageFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  cloudinary,
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
};
