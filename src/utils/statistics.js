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
  return a.diff(b, period) === 0;
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
  let ratingsGenres = [];

  movies.map((movie) => Array.from(movie.genres))
  .filter((genres) => genres.length > 0)
  .flat()
  .reduce((accumulator, genre) => {
    const index = ratingsGenres.findIndex((it) => it.genre === genre);

    if (index === -1) {
      ratingsGenres.push({genre, count: 1});
    } else {
      ratingsGenres[index].count += 1;
    }
  }, 0);

  return ratingsGenres.sort((a, b) => b.count - a.count);
};

export const getTopGenreMovie = (movies) => {
  if (movies.length > 0) {
    const ratingsGenres = getSortCountMovieGenres(movies);
    return (ratingsGenres.length > 0) ? ratingsGenres[0].genre : `–`;
  }

  return `–`;
};
