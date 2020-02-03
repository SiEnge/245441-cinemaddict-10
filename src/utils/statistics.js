import moment from 'moment';
import {StatiscticsPeriod} from '../const.js';

const MomentPeriod = {
  TODAY: `days`,
  WEEK: `weeks`,
  MONTH: `months`,
  YEAR: `years`,
};

const isPeriod = (dateA, dateB, period) => {
  const a = moment(dateA);
  const b = moment(dateB);
  return a.diff(b, period) === 0 && dateA.getDate() === dateB.getDate();
};

const getMoviesForToday = (movies) => {
  const today = new Date();
  return movies.filter((movie) => isPeriod(movie.watchingDate, today, MomentPeriod.TODAY));
};

const getMoviesForWeek = (movies) => {
  const today = new Date();
  return movies.filter((movie) => isPeriod(movie.watchingDate, today, MomentPeriod.WEEK));
};

const getMoviesForMonth = (movies) => {
  const today = new Date();
  return movies.filter((movie) => isPeriod(movie.watchingDate, today, MomentPeriod.MONTH));
};

const getMoviesForYear = (movies) => {
  const today = new Date();
  return movies.filter((movie) => isPeriod(movie.watchingDate, today, MomentPeriod.YEAR));
};

export const getWatchedMoviesByPeriod = (watchedMovies, period) => {
  let watchedMoviesByPeriod;
  switch (period) {
    case StatiscticsPeriod.ALLTIME:
      watchedMoviesByPeriod = watchedMovies;
      break;
    case StatiscticsPeriod.TODAY:
      watchedMoviesByPeriod = getMoviesForToday(watchedMovies);
      break;
    case StatiscticsPeriod.WEEK:
      watchedMoviesByPeriod = getMoviesForWeek(watchedMovies);
      break;
    case StatiscticsPeriod.MONTH:
      watchedMoviesByPeriod = getMoviesForMonth(watchedMovies);
      break;
    case StatiscticsPeriod.YEAR:
      watchedMoviesByPeriod = getMoviesForYear(watchedMovies);
      break;
  }
  return watchedMoviesByPeriod;
};

export const getDurationMovie = (movies) => {
  return movies.reduce((accumulator, currentValue) => accumulator + currentValue.duration, 0);
};

export const getSortCountMovieGenres = (movies) => {
  let ratingsGenre = [];

  movies.map((movie) => Array.from(movie.genres))
  .filter((genres) => genres.length > 0)
  .flat()
  .reduce((accumulator, genre) => {
    const index = ratingsGenre.findIndex((it) => it.genre === genre);

    if (index === -1) {
      ratingsGenre.push({genre, count: 1});
    } else {
      ratingsGenre[index].count += 1;
    }
  }, 0);

  return ratingsGenre.sort((a, b) => b.count - a.count);
};

export const getTopGenreMovie = (movies) => {
  if (movies.length > 0 && movies[0].genres.size > 0) {
    return getSortCountMovieGenres(movies)[0].genres;
  } else {
    return `–`;
  }
};
