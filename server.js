const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const jwt = require('express-jwt');
const cors = require('cors');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const JWT_SECRET = require('./constants');

const app = express();
const auth = jwt({
  secret: JWT_SECRET,
  credentialsRequired: false,
  algorithms: ['HS256'],
});
app.use(auth);
app.use(cors());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: {
    endpoint: '/graphql',
  },
  context: ({ req }) => {
    const user = req.headers.user
      ? JSON.parse(req.headers.user)
      : req.user
      ? req.user
      : null;

    return { user };
  },
});

server.applyMiddleware({ app });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log('The server started on port ' + PORT);
});
