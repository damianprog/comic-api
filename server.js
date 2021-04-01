const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const jwt = require('express-jwt');
const cors = require('cors');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const cookieParser = require('cookie-parser');
const JWT_SECRET = require('./config.js');

const app = express();
app.use(cookieParser());
const auth = jwt({
  secret: JWT_SECRET,
  getToken: (req) => req.cookies.authToken,
  credentialsRequired: false,
  algorithms: ['HS256'],
});
app.use(auth);
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  })
);
const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: {
    endpoint: '/graphql',
  },
  context: ({ req, res }) => {
    const user = req.headers.user
      ? JSON.parse(req.headers.user)
      : req.user
      ? req.user
      : null;

    return { user, res };
  },
});

server.applyMiddleware({ app, cors: false });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log('The server started on port ' + PORT);
});
