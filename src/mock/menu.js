export const countFilmsFilter = (films) => {
  let countWatchlist = 0;
  let countHistory = 0;
  let countFavorites = 0;

  films.forEach(function (film) {
    if (film.isWatchlist) {
      countWatchlist++;
    }
    if (film.isWatched) {
      countHistory++;
    }
    if (film.isFavorite) {
      countFavorites++;
    }
  });

  return {
    countWatchlist,
    countHistory,
    countFavorites
  };
};
