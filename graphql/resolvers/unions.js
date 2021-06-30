module.exports = {
  UserActivity: {
    __resolveType(obj) {
      if (obj.text) {
        return 'Review';
      }
      if (obj.category) {
        return 'UserComic';
      }
      return null;
    },
  },
};
