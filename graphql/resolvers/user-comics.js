const { Comic, UserComic, User } = require('../../models');
const { Op } = require('sequelize');

module.exports = {
  Query: {
    async userComics(_, { userId, nickname, comicId }) {
      let userComics = [];
      let foundUserId = userId;

      if (nickname) {
        const user = await User.findOne({ where: { nickname } });
        foundUserId = user ? user.id : foundUserId;
      }

      if (foundUserId && comicId) {
        userComics = await UserComic.findAll({
          where: { userId: foundUserId, comicId },
          include: ['comic', 'user'],
        });
      } else if (foundUserId) {
        userComics = await UserComic.findAll({
          where: { userId: foundUserId },
          include: ['comic', 'user'],
        });
      }

      return userComics;
    },
    async userComicsCategories(_, { userId, nickname }) {
      let foundUserId = userId;

      if (nickname) {
        const user = await User.findOne({ where: { nickname } });
        foundUserId = user ? user.id : foundUserId;
      }

      const userComics = await UserComic.findAll({
        where: { userId: foundUserId },
        raw: true,
      });

      const allUserComicsCategories = userComics.map(
        (userComic) => userComic.category
      );
      const uniqueUserComicsCategories = [...new Set(allUserComicsCategories)];

      uniqueUserComicsCategories.sort();

      return uniqueUserComicsCategories;
    },
  },

  Mutation: {
    async createUserComic(_, { input, category }, { user }) {
      if (user) {
        try {
          const { id } = input;
          let comic = await Comic.findOne({ where: { id } });
          if (!comic) {
            comic = await Comic.create(input);
          }
          let userComic = await UserComic.findOne({
            where: { comicId: comic.id, userId: user.id, category },
          });

          if (userComic) throw new Error('Provided UserComic already exists.');

          userComic = await UserComic.create({
            category,
            comicId: comic.id,
            userId: user.id,
          });

          userComic.comic = comic;
          return userComic;
        } catch (err) {
          throw new Error(err);
        }
      }
      throw new Error("Sorry, you're not an authenticated user!");
    },
    async deleteUserComic(_, { id }, { user }) {
      if (user) {
        try {
          const deletedUserComic = await UserComic.findOne({ where: { id } });
          deletedUserComic.destroy();

          const deletedUserComicWithComic =
            setComicInUserComic(deletedUserComic);

          return deletedUserComicWithComic;
        } catch (err) {
          throw new Error(err);
        }
      }

      throw new Error("Sorry, you're not an authenticated user!");
    },
  },
};
