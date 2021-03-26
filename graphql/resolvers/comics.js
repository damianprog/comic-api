const { Comic } = require('../../models');

module.exports = {
  Query: {
    async comics() {
      try {
        const comics = await Comic.findAll();
        return comics;
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    async createComic(_, { input }) {
      try {
        const comic = await Comic.create(input);
        return comic;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
