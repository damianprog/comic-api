const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const {
  validateSignUpInput,
  validateSignInInput,
} = require('../../utils/validators');
const { JWT_KEY } = require('../../config');
const { User } = require('../../models');

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_KEY,
    { expiresIn: '1h' }
  );
}

module.exports = {
  Mutation: {
    async signIn(_, { email, password }) {
      const { errors, valid } = validateSignInInput(email, password);
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

      return {
        ...user.dataValues,
        token,
      };
    },
    async signUp(_, { signUpInput: { nickname, email, password, birthDate } }) {
      // Validate user data
      const { valid, errors } = validateSignUpInput(
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
      const token = generateToken(newUser);

      return {
        ...newUser.dataValues,
        token,
      };
    },
  },
};
