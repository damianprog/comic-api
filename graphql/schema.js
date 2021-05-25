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

  input UserSearch {
    id: ID
    nickname: String
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
    birthDate: String
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

  input NewComicInput {
    id: ID!
    title: String!
    coverImage: String
    onsaleDate: String
    writer: String
    inker: String
    penciler: String
    description: String
    seriesId: ID
  }

  type Comic {
    id: ID!
    title: String!
    coverImage: String
    onsaleDate: String
    writer: String
    inker: String
    penciler: String
    description: String
    seriesId: ID
  }

  type UserComic {
    id: ID!
    userId: ID!
    comic: Comic!
    category: String
    createdAt: String
  }

  type Query {
    user(where: UserSearch!): User
    currentUser: User!
    comic(id: ID): Comic
    userComics(userId: ID, comicId: ID): [UserComic]
    userComicsCategories(userId: ID): [String]
  }

  type Mutation {
    signup(signupInput: SignupInput): User!
    signin(email: String!, password: String!): User!
    updateUser(input: UpdateUserInput!): User
    createComic(input: NewComicInput!): Comic!
    createUserComic(input: NewComicInput!, category: String!): UserComic
    deleteUserComic(id: ID): UserComic
    signout: Boolean
  }
`;

module.exports = typeDefs;
