const { Comic, UserComic, User } = require('../../models');
const { setComicsInUserComics } = require('../actions/comics-actions');
const { Op } = require('sequelize');

module.exports = {
  Query: {
    async comic(_, { where: { id, marvelApiId } }) {
      try {
        const comic = await Comic.findOne({
          where: {
            [Op.or]: [
              {
                id: id ? id : 0,
              },
              {
                marvelApiId: marvelApiId ? marvelApiId : 0,
              },
            ],
          },
        });
        return comic;
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
