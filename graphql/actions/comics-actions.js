const { Comic, UserComic, User } = require('../../models');

const getComicsMap = (comics) => {
  const comicsByIds = new Map();

  comics.forEach((comic) => comicsByIds.set(comic.id, comic));

  return comicsByIds;
};

const setComicInUserComic = async (userComic) => {
  const { comicId } = userComic;

  const comic = await Comic.findOne({ where: { id: comicId } });

  userComic.comic = comic;

  return userComic;
};

module.exports = {
  setComicInUserComic,
};
