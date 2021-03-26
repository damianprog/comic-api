const { User, Comic } = require('./models');

const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const JWT_SECRET = require('./constants');

const resolvers = {
  Query: {
    async current(_, args, { user }) {
      if (user) {
        return await User.findOne({ where: { id: user.id } });
      }
      throw new Error("Sorry, you're not an authenticated user!");
    },

    async comics() {
      return Comic.findAll();
    },
  },

  Mutation: {
    async register(_, { nickname, email, password }) {
      const user = await User.create({
        nickname,
        email,
        password: await bcrypt.hash(password, 10),
      });

      return jsonwebtoken.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '3m',
      });
    },

    async login(_, { email, password }) {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw new Error(
          "This user doesn't exit. Please, make sure to type the right email"
        );
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        throw new Error('Incorrect password');
      }

      return jsonwebtoken.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '1d',
      });
    },

    async createComic(_, { input }) {
      const comic = await Comic.create(input);
      return comic;
    },
  },
};

module.exports = resolvers;
