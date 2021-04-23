const {
  cloudinary,
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} = require('../../utils/cloudinary');
const { User, UserDetails, StoredImage } = require('../../models');

const updateUserImages = async (user, newUserImages) => {
  await Promise.all(
    newUserImages.map(async ({ type, base64 }) => {
      let newStoredImageId = 0;

      if (base64) {
        const uploadResponse = await uploadImageToCloudinary(
          base64,
          'users_images'
        );

        const newStoredImage = await StoredImage.create({
          url: uploadResponse.url,
          publicId: uploadResponse.public_id,
        });

        newStoredImageId = newStoredImage.id;
      }

      if (base64 || base64 === '') {
        const storedImageId = user.userDetails[`${type}StoredImageId`];

        const storedImage = await StoredImage.findOne({
          where: { id: storedImageId },
        });

        if (storedImage) {
          await deleteImageFromCloudinary(storedImage.publicId);
          await storedImage.destroy();
        }

        user.userDetails[`${type}StoredImageId`] = newStoredImageId;
      }
    })
  );

  return user;
};

const updateUserAction = async (
  user,
  { nickname, about, interests, profileImageBase64, backgroundImageBase64 }
) => {
  user.nickname = nickname;
  user.userDetails.about = about;
  user.userDetails.interests = interests;

  const userImages = [
    { type: 'profile', base64: profileImageBase64 },
    { type: 'background', base64: backgroundImageBase64 },
  ];

  user = updateUserImages(user, userImages);

  return user;
};

module.exports = {
  updateUserAction,
};
