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
const { User, UserDetails, Review, UserComic } = require('../../models');
const { updateUserAction } = require('../actions/users-actions');

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
  UserActivity: {
    __resolveType(obj, context, info) {
      if (obj.text) {
        return 'Review';
      }
      if (obj.category) {
        return 'UserComic';
      }
      return null; // GraphQLError is thrown
    },
  },
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
      throw new Error("Sorry, you're not an authenticated user!");
    },
    async userActivity(_, { userId, first, lastCreatedAt = 0 }) {
      const userReviews = await Review.findAll({
        where: { userId },
        include: ['comic', 'user'],
      });
      const userComics = await UserComic.findAll({
        where: { userId },
        include: ['comic', 'user'],
      });

      const sortedUserActivities = [...userReviews, ...userComics].sort(
        (a, b) => parseInt(b.createdAt) - parseInt(a.createdAt)
      );

      const previousLastUserActivityIndex = sortedUserActivities.findIndex(
        (userActivity) => +userActivity.createdAt === +lastCreatedAt
      );

      const currentFirstUserActivityIndex = previousLastUserActivityIndex + 1;

      const userActivities = sortedUserActivities.slice(
        currentFirstUserActivityIndex,
        currentFirstUserActivityIndex + first
      );

      return userActivities;
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

        signedUser = await updateUserAction(signedUser, updateUserInput);

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
