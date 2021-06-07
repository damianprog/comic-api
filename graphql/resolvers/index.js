const comicsResolvers = require('./comics');
const usersResolvers = require('./users');
const userComicsResolvers = require('./user-comics');
const reviewsResolvers = require('./reviews');

module.exports = {
  Query: {
    ...usersResolvers.Query,
    ...comicsResolvers.Query,
    ...userComicsResolvers.Query,
    ...reviewsResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...comicsResolvers.Mutation,
    ...userComicsResolvers.Mutation,
    ...reviewsResolvers.Mutation,
  },
};
