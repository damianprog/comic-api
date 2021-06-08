const { UserInputError } = require('apollo-server-errors');
const { Comic, Review } = require('../../models');
const { Op } = require('sequelize');

module.exports = {
  Query: {
    async review(_, { id }) {
      const foundReview = await Review.findOne({
        where: { id },
        include: { all: true, nested: true },
      });

      return foundReview;
    },
    async reviews(_, { userId, comicId }) {
      const foundReviews = await Review.findAll({
        where: {
          [Op.or]: [
            {
              comicId: comicId ? comicId : 0,
            },
            {
              userId: userId ? userId : 0,
            },
          ],
        },
        include: { all: true, nested: true },
      });

      return foundReviews;
    },
  },
  Mutation: {
    async createReview(_, { newComicInput, text }, { user }) {
      if (user) {
        if (text.trim() === '') {
          throw new UserInputError('Errors', {
            errors: { text: 'Review text must not be empty' },
          });
        }
        try {
          const alreadyCreatedReview = await Review.findOne({
            where: { comicId: newComicInput.id, userId: user.id },
          });

          if (alreadyCreatedReview)
            throw new Error('Provided Review already exists.');

          const { id } = newComicInput;
          let comic = await Comic.findOne({ where: { id } });
          if (!comic) {
            comic = await Comic.create(newComicInput);
          }

          let review = await Review.create({
            text,
            comicId: comic.id,
            userId: user.id,
          });

          review = await Review.findOne({
            where: { id: review.id },
            include: ['comic', 'user'],
          });

          return review;
        } catch (err) {
          throw new Error(err);
        }
      }

      throw new Error("Sorry, you're not an authenticated user!");
    },
    async updateReview(_, { comicId, text }, { user }) {
      if (user) {
        if (text.trim() === '') {
          throw new UserInputError('Errors', {
            errors: { text: 'Review text must not be empty' },
          });
        }

        const review = await Review.findOne({
          where: { comicId, userId: user.id },
          include: ['comic', 'user'],
        });
        review.text = text;
        await review.save();

        return review;
      }

      throw new Error("Sorry, you're not an authenticated user!");
    },
  },
};
