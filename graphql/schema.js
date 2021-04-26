const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    nickname: String!
    email: String!
    birthDate: String!
    createdAt: String!
    userDetails: UserDetails
  }

  type UserDetails {
    id: ID!
    about: String
    interests: String
    profileImage: String
    backgroundImage: String
  }

  input UpdateUserInput {
    nickname: String
    about: String
    interests: String
    profileImageBase64: String
    backgroundImageBase64: String
  }

  input SignupInput {
    nickname: String!
    email: String!
    password: String!
    birthDate: String!
  }

  type Comic {
    id: ID!
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
    user(id: Int, nickname: String): User!
    currentUser: User!
    comics: [Comic!]
  }

  type Mutation {
    signup(signupInput: SignupInput): User!
    signin(email: String!, password: String!): User!
    updateUser(input: UpdateUserInput!): User
    createComic(input: NewComicInput!): Comic!
    signout: Boolean
  }
`;

module.exports = typeDefs;
