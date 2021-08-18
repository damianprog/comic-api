const { UserInputError } = require('apollo-server-errors');
const { Comic, Review } = require('../../models');
const { Op } = require('sequelize');
const { AuthenticationError } = require('apollo-server-express');
const {
  validateReviewInput,
} = require('../../utils/validators/review-mutations-validators');

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
        const { errors, valid } = validateReviewInput({ text });

        if (!valid) {
          throw new UserInputError('Errors', errors);
        }

        if (text.trim() === '') {
          throw new UserInputError('Errors', {
            text: 'Review text must not be empty',
          });
        }
        const alreadyCreatedReview = await Review.findOne({
          where: { comicId: newComicInput.id, userId: user.id },
        });

        if (alreadyCreatedReview)
          throw new UserInputError('Provided Review already exists.');

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
      }

      throw new AuthenticationError("Sorry, you're not an authenticated user!");
    },
    async updateReview(_, { comicId, text }, { user }) {
      if (user) {
        const { errors, valid } = validateReviewInput({ text });

        if (!valid) {
          throw new UserInputError('Errors', errors);
        }

        const review = await Review.findOne({
          where: { comicId, userId: user.id },
          include: ['comic', 'user'],
        });
        review.text = text;
        await review.save();

        return review;
      }

      throw new AuthenticationError("Sorry, you're not an authenticated user!");
    },
  },
};
