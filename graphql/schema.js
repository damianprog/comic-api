const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    nickname: String!
    email: String!
    birthDate: String!
    createdAt: String!
  }

  type AuthResponse {
    user: User!
    token: String!
  }

  input SignupInput {
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
    currentUser: User
    comics: [Comic]
  }

  type Mutation {
    signup(signupInput: SignupInput): AuthResponse!
    signin(email: String!, password: String!): AuthResponse!
    createComic(input: NewComicInput!): Comic!
    signout: Boolean
  }
`;

module.exports = typeDefs;
