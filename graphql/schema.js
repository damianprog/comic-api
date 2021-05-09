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
    id: Int
    nickname: String
  }

  input ComicSearch {
    id: Int
    marvelApiId: Int
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

  type UserComic {
    id: ID!
    userId: Int!
    comic: Comic!
    category: String
  }

  type Query {
    user(where: UserSearch!): User
    currentUser: User!
    comic(where: ComicSearch!): Comic
    userComics(userId: Int, comicId: Int): [UserComic]
    userComicsCategories(userId: Int): [String]
  }

  type Mutation {
    signup(signupInput: SignupInput): User!
    signin(email: String!, password: String!): User!
    updateUser(input: UpdateUserInput!): User
    createComic(input: NewComicInput!): Comic!
    createUserComic(input: NewComicInput!, category: String!): UserComic
    signout: Boolean
  }
`;

module.exports = typeDefs;
