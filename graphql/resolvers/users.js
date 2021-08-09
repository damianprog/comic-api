const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server-express');
const { cloudinary } = require('../../utils/cloudinary');
const { Op } = require('sequelize');
const { AuthenticationError } = require('apollo-server-express');

const {
  validateSignupInput,
  validateSigninInput,
} = require('../../utils/validators');
const JWT_SECRET = require('../../config');
const { User, UserDetails } = require('../../models');
const { updateUserProperties } = require('../resolvers-utils/users-utils');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = {
  Query: {
    async user(_, { where: { id, nickname } }) {
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

      if (foundUser) return foundUser;

      throw new UserInputError('User not found');
    },
    async currentUser(_, args, { user }) {
      if (user) {
        const signedUser = await User.findOne({
          where: { id: user.id },
          include: 'userDetails',
        });
        return signedUser;
      }
      throw new AuthenticationError("Sorry, you're not an authenticated user!");
    },
  },
  Mutation: {
    async signin(_, { email, password }, { res }) {
      const { errors, valid } = validateSigninInput(email, password);
      const user = await User.findOne({
        where: { email },
        include: 'userDetails',
      });

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
        sameSite: 'none',
        secure: true,
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

      const userDetails = await UserDetails.create({ userId: newUser.id });

      newUser.userDetails = userDetails;

      const token = generateToken(newUser);

      res.cookie('authToken', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      return newUser;
    },

    async updateUser(_, { updateUserInput }, { user }) {
      if (user) {
        let signedUser = await User.findOne({
          where: { id: user.id },
          include: 'userDetails',
        });

        signedUser = await updateUserProperties(signedUser, updateUserInput);

        await signedUser.userDetails.save();
        await signedUser.save();

        return signedUser;
      }

      throw new AuthenticationError("Sorry, you're not an authenticated user!");
    },
    async signout(_, __, { res }) {
      res.cookie('authToken', '', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });

      return true;
    },
  },
};
