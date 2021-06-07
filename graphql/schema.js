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
    user: User!
    comic: Comic!
    category: String
    createdAt: String
  }

  type Review {
    id: ID!
    comic: Comic!
    user: User!
    text: String!
    createdAt: String
  }

  type Query {
    user(where: UserSearch!): User
    currentUser: User!
    comic(id: ID): Comic
    userComics(userId: ID, nickname: String, comicId: ID): [UserComic]
    userComicsCategories(userId: ID, nickname: String): [String]
    reviews(userId: ID, comicId: ID): [Review]
  }

  type Mutation {
    signup(signupInput: SignupInput): User!
    signin(email: String!, password: String!): User!
    updateUser(updateUserInput: UpdateUserInput!): User
    createComic(newComicInput: NewComicInput!): Comic!
    createUserComic(newComicInput: NewComicInput!, category: String!): UserComic
    deleteUserComic(id: ID): UserComic
    createReview(newComicInput: NewComicInput!, text: String!): Review
    updateReview(comicId: ID!, text: String!): Review
    signout: Boolean
  }
`;

module.exports = typeDefs;
