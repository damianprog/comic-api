const { Comic, UserComic, User } = require('../../models');

const getComicsMap = (comics) => {
  const comicsByIds = new Map();

  comics.forEach((comic) => comicsByIds.set(comic.id, comic));

  return comicsByIds;
};

const setComicsInUserComics = async (userComics) => {
  const comicsIds = userComics.map((userComic) => userComic.comicId);

  const comics = await Comic.findAll({
    where: { id: comicsIds },
    raw: true,
  });

  const comicsByIds = getComicsMap(comics);

  const userComicsWithComics = userComics.map((userComic) => ({
    ...userComic,
    comic: comicsByIds.get(userComic.comicId),
  }));

  return userComicsWithComics;
};

module.exports = {
  setComicsInUserComics,
};
