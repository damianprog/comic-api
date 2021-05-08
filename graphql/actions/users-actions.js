const {
  cloudinary,
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} = require('../../utils/cloudinary');
const { User, UserDetails } = require('../../models');

const updateUserImages = async (user, newUserImages) => {
  await Promise.all(
    newUserImages.map(async ({ type, base64 }) => {
      let newImage = '';
      let newPublicId = '';

      if (base64) {
        const uploadResponse = await uploadImageToCloudinary(
          base64,
          'users_images'
        );

        newImage = uploadResponse.url;
        newPublicId = uploadResponse.public_id;
      }

      const oldImagePublicId = user.userDetails[`${type}ImagePublicId`];

      await deleteImageFromCloudinary(oldImagePublicId);

      user.userDetails[`${type}Image`] = newImage;
      user.userDetails[`${type}ImagePublicId`] = newPublicId;
    })
  );

  return user;
};

const updateUserAction = async (
  user,
  {
    nickname,
    birthDate,
    about,
    interests,
    profileImageBase64,
    backgroundImageBase64,
  }
) => {
  user.nickname = nickname;
  user.birthDate = birthDate;
  user.userDetails.about = about;
  user.userDetails.interests = interests;

  let userImages = [
    { type: 'profile', base64: profileImageBase64 },
    { type: 'background', base64: backgroundImageBase64 },
  ];

  userImages = userImages.filter(
    (image) => typeof image.base64 !== 'undefined'
  );

  user = updateUserImages(user, userImages);

  return user;
};

module.exports = {
  updateUserAction,
};
