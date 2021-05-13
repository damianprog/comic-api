const { Comic, UserComic, User } = require('../../models');
const { setComicInUserComic } = require('../actions/comics-actions');
const { Op } = require('sequelize');

module.exports = {
  Query: {
    async userComics(_, { userId, comicId }) {
      let userComics = [];

      if (userId && comicId) {
        userComics = await UserComic.findAll({
          where: { userId, comicId },
          raw: true,
        });
      } else {
        userComics = await UserComic.findAll({
          where: {
            [Op.or]: [
              {
                userId: userId ? userId : 0,
              },
              {
                comicId: comicId ? comicId : 0,
              },
            ],
          },
          raw: true,
        });
      }

      const userComicsWithComics = userComics.map((userComic) =>
        setComicInUserComic(userComic)
      );

      return userComicsWithComics;
    },
    async userComicsCategories(_, { userId }) {
      const userComics = await UserComic.findAll({
        where: { userId },
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
          if (!userComic) {
            userComic = await UserComic.create({
              category,
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
