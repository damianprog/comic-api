const comicsResolvers = require('./comics');
const usersResolvers = require('./users');
const userComicsResolvers = require('./user-comics');

module.exports = {
  Query: {
    ...usersResolvers.Query,
    ...comicsResolvers.Query,
    ...userComicsResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...comicsResolvers.Mutation,
    ...userComicsResolvers.Mutation,
  },
};
