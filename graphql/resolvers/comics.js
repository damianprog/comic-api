const { Comic } = require('../../models');
const { Op } = require('sequelize');

module.exports = {
  Query: {
    async comic(_, { id }) {
      try {
        const comic = await Comic.findOne({ where: { id } });
        return comic;
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    async createComic(_, { newComicInput }) {
      try {
        const comic = await Comic.create(newComicInput);
        return comic;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
