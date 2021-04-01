const comicsResolvers = require('./comics');
const usersResolvers = require('./users');

module.exports = {
  Query: {
    ...usersResolvers.Query,
    ...comicsResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...comicsResolvers.Mutation,
  },
};
