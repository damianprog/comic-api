const { Review, UserComic } = require('../../models');

module.exports = {
  Query: {
    async userActivities(_, { userId, quantity, lastActivityCreatedAt = 0 }) {
      const userReviews = await Review.findAll({
        where: { userId },
        include: { all: true, nested: true },
      });
      const userComics = await UserComic.findAll({
        where: { userId },
        include: { all: true, nested: true },
      });

      const sortedActivities = [...userReviews, ...userComics].sort(
        (a, b) => +b.createdAt - +a.createdAt
      );

      const previousLastActivityIndex = sortedActivities.findIndex(
        (userActivity) => +userActivity.createdAt === +lastActivityCreatedAt
      );

      const currentFirstActivityIndex = previousLastActivityIndex + 1;

      const userActivities = sortedActivities.slice(
        currentFirstActivityIndex,
        currentFirstActivityIndex + quantity
      );

      return userActivities;
    },
  },
};
