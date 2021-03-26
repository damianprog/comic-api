const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    nickname: String!
    email: String!
    token: String!
    birthDate: String!
    createdAt: String!
  }

  input SignUpInput {
    nickname: String!
    email: String!
    password: String!
    birthDate: String!
  }

  type Comic {
    id: Int!
    marvelApiId: Int!
    title: String!
    coverImage: String
    onsaleDate: String
    writer: String
    inker: String
    penciler: String
    description: String
    seriesId: Int
  }

  input NewComicInput {
    marvelApiId: Int!
    title: String!
    coverImage: String
    onsaleDate: String
    writer: String
    inker: String
    penciler: String
    description: String
    seriesId: Int
  }

  type Query {
    comics: [Comic]
  }

  type Mutation {
    signUp(signUpInput: SignUpInput): User!
    signIn(email: String!, password: String!): User!
    createComic(input: NewComicInput!): Comic!
  }
`;

module.exports = typeDefs;
