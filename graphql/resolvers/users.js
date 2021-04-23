const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server-express');
const { cloudinary } = require('../../utils/cloudinary');
const { Op } = require('sequelize');

const {
  validateSignupInput,
  validateSigninInput,
} = require('../../utils/validators');
const JWT_SECRET = require('../../config');
const { User, UserDetails, StoredImage } = require('../../models');

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

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

module.exports = {
  Query: {
    async user(_, { id, nickname }) {
      const foundUser = await User.findOne({
        where: {
          [Op.or]: [
            {
              id: id ? id : 0,
            },
            {
              nickname: nickname ? nickname : '',
            },
          ],
        },
        include: 'userDetails',
      });

      if (foundUser) {
        const {
          profileStoredImageId,
          backgroundStoredImageId,
        } = foundUser.userDetails;

        const profileStoredImage = await StoredImage.findOne({
          where: { id: profileStoredImageId },
        });
        const backgroundStoredImage = await StoredImage.findOne({
          where: { id: backgroundStoredImageId },
        });

        foundUser.userDetails.profileImageUrl = profileStoredImage
          ? profileStoredImage.url
          : '';
        foundUser.userDetails.backgroundImageUrl = backgroundStoredImage
          ? backgroundStoredImage.url
          : '';

        return foundUser;
      }

      throw new UserInputError('User not found');
    },
    async currentUser(_, args, { user }) {
      if (user) {
        const test = await User.findOne({ where: { id: user.id } });
        console.log('user: ', test);
        return test;
      }
      throw new Error("Sorry, you're not an authenticated user!");
    },
  },
  Mutation: {
    async signin(_, { email, password }, { res }) {
      const { errors, valid } = validateSigninInput(email, password);
      const user = await User.findOne({ where: { email } });

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = 'Wrong credentials';
        throw new UserInputError('Wrong credentials', { errors });
      }

      const token = generateToken(user);

      res.cookie('authToken', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      return user;
    },
    async signup(
      _,
      { signupInput: { nickname, email, password, birthDate } },
      { res }
    ) {
      // Validate user data

      const { valid, errors } = validateSignupInput(
        nickname,
        email,
        password,
        birthDate
      );

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      // Make sure user doesnt already exist
      const duplicateErrors = {};

      const userWithNickname = await User.findOne({ where: { nickname } });
      if (userWithNickname) duplicateErrors.nickname = 'This nickname is taken';

      const userWithEmail = await User.findOne({ where: { email } });
      if (userWithEmail) duplicateErrors.email = 'This email is taken';

      if (Object.keys(duplicateErrors).length > 0) {
        throw new UserInputError('Errors', { errors: duplicateErrors });
      }
      // hash password and create an auth token
      password = await bcrypt.hash(password, 12);

      const newUser = await User.create({
        nickname,
        email,
        password,
        birthDate,
      });

      await UserDetails.create({ userId: newUser.id });

      const token = generateToken(newUser);

      res.cookie('authToken', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      return newUser;
    },

    async updateUser(
      _,
      {
        input: {
          nickname,
          about,
          interests,
          profileImageBase64,
          backgroundImageBase64,
        },
      },
      { user }
    ) {
      if (user) {
        const signedUser = await User.findOne({
          where: { id: user.id },
          include: 'userDetails',
        });

        signedUser.nickname = nickname;
        signedUser.userDetails.about = about;
        signedUser.userDetails.interests = interests;

        await Promise.all(
          [
            { type: 'profile', base64: profileImageBase64 },
            { type: 'background', base64: backgroundImageBase64 },
          ].map(async ({ type, base64 }) => {
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
              const storedImageId =
                signedUser.userDetails[`${type}StoredImageId`];

              const storedImage = await StoredImage.findOne({
                where: { id: storedImageId },
              });

              if (storedImage) {
                try {
                  await cloudinary.uploader.destroy(storedImage.publicId);
                } catch (error) {
                  console.log(error);
                }

                await storedImage.destroy();
              }

              signedUser.userDetails[`${type}StoredImageId`] = newStoredImageId;
            }
          })
        );

        await signedUser.userDetails.save();
        await signedUser.save();

        return signedUser;
      }

      throw new Error("Sorry, you're not an authenticated user!");
    },
    async signout(_, __, { res }) {
      res.cookie('authToken', '', {
        httpOnly: true,
      });

      return true;
    },
  },
};
