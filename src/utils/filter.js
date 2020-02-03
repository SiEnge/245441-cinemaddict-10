import {getWatchedMovies} from './common.js';
import {FilterType} from '../const.js';

const getWatchlistMovies = (movies) => {
  return movies.filter((movie) => movie.isWatchlist);
};

const getFavoritesMovies = (movies) => {
  return movies.filter((movie) => movie.isFavorite);
};

export const getMoviesByFilter = (movies, filterType) => {
  let filteredMovies;

  switch (filterType) {
    case FilterType.ALL:
      filteredMovies = movies;
      break;
    case FilterType.WATCHLIST:
      filteredMovies = getWatchlistMovies(movies);
      break;
    case FilterType.HISTORY:
      filteredMovies = getWatchedMovies(movies);
      break;
    case FilterType.FAVORITES:
      filteredMovies = getFavoritesMovies(movies);
      break;
  }
  return filteredMovies;
};
