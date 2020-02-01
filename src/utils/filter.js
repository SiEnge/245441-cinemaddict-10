import {getWatchedMovies} from './common.js';
import {FilterType} from '../const.js';

const getWatchlistFilms = (films) => {
  return films.filter((film) => film.isWatchlist);
};

const getFavoritesFilms = (films) => {
  return films.filter((film) => film.isFavorite);
};

export const getFilmsByFilter = (films, filterType) => {
  let filteredFilms;

  switch (filterType) {
    case FilterType.ALL:
      filteredFilms = films;
      break;
    case FilterType.WATCHLIST:
      filteredFilms = getWatchlistFilms(films);
      break;
    case FilterType.HISTORY:
      filteredFilms = getWatchedMovies(films);
      break;
    case FilterType.FAVORITES:
      filteredFilms = getFavoritesFilms(films);
      break;
  }
  return filteredFilms;
};
