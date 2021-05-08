const { Comic, UserComic, User } = require('../../models');
const { setComicsInUserComics } = require('../actions/comics-actions');

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

    async userComics(_, { userId }) {
      const userComics = await UserComic.findAll({
        where: { userId },
        raw: true,
      });

      const userComicsWithComics = setComicsInUserComics(userComics);

      return userComicsWithComics;
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
    async createUserComic(_, { input, type }, { user }) {
      if (user) {
        try {
          const { marvelApiId } = input;
          let comic = await Comic.findOne({ where: { marvelApiId } });
          if (!comic) {
            comic = await Comic.create(input);
          }

          let userComic = await UserComic.findOne({
            where: { comicId: comic.id, userId: user.id, type },
          });

          if (!userComic) {
            userComic = await UserComic.create({
              type,
              comicId: comic.id,
              userId: user.id,
            });
          }

          userComic.comic = comic;

          return userComic;
        } catch (err) {
          throw new Error(err);
        }
      }

      throw new Error("Sorry, you're not an authenticated user!");
    },
  },
};
