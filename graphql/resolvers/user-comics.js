const { Comic, UserComic, User } = require('../../models');

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
    async createUserComic(_, { newComicInput, category }, { user }) {
      if (user) {
        try {
          const alreadyCreatedUserComic = await UserComic.findOne({
            where: { comicId: comic.id, userId: user.id, category },
          });

          if (alreadyCreatedUserComic)
            throw new Error('Provided UserComic already exists.');

          const { id } = newComicInput;
          let comic = await Comic.findOne({ where: { id } });
          if (!comic) {
            comic = await Comic.create(newComicInput);
          }

          let newUserComic = await UserComic.create({
            category,
            comicId: comic.id,
            userId: user.id,
          });

          // Finding just created userComic to get associated objects
          newUserComic = await UserComic.findOne({
            where: { id: newUserComic.id },
            include: ['comic', 'user'],
          });

          return newUserComic;
        } catch (err) {
          throw new Error(err);
        }
      }
      throw new Error("Sorry, you're not an authenticated user!");
    },
    async deleteUserComic(_, { id }, { user }) {
      if (user) {
        try {
          const deletedUserComic = await UserComic.findOne({
            where: { id },
            include: ['user', 'comic'],
          });
          deletedUserComic.destroy();

          return deletedUserComic;
        } catch (err) {
          throw new Error(err);
        }
      }

      throw new Error("Sorry, you're not an authenticated user!");
    },
  },
};
