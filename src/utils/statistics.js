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

const getFilmsForToday = (films) => {
  const today = new Date();
  return films.filter((film) => isPeriod(film.watchingDate, today, MomentPeriod.TODAY));
};

const getFilmsForWeek = (films) => {
  const today = new Date();
  return films.filter((film) => isPeriod(film.watchingDate, today, MomentPeriod.WEEK));
};

const getFilmsForMonth = (films) => {
  const today = new Date();
  return films.filter((film) => isPeriod(film.watchingDate, today, MomentPeriod.MONTH));
};

const getFilmsForYear = (films) => {
  const today = new Date();
  return films.filter((film) => isPeriod(film.watchingDate, today, MomentPeriod.YEAR));
};

export const getWatchedFilmsByPeriod = (watchedFilms, period) => {
  let watchedFilmsByPeriod;
  switch (period) {
    case StatiscticsPeriod.ALLTIME:
      watchedFilmsByPeriod = watchedFilms;
      break;
    case StatiscticsPeriod.TODAY:
      watchedFilmsByPeriod = getFilmsForToday(watchedFilms);
      break;
    case StatiscticsPeriod.WEEK:
      watchedFilmsByPeriod = getFilmsForWeek(watchedFilms);
      break;
    case StatiscticsPeriod.MONTH:
      watchedFilmsByPeriod = getFilmsForMonth(watchedFilms);
      break;
    case StatiscticsPeriod.YEAR:
      watchedFilmsByPeriod = getFilmsForYear(watchedFilms);
      break;
  }
  return watchedFilmsByPeriod;

};

export const getDurationFilm = (films) => {
  return films.reduce((accumulator, currentValue) => accumulator + currentValue.duration, 0);
};

export const getSortCountFilmGenres = (films) => {
  // let accumulator = 0;
  const genresRating = {};
  let ratings = [];

  films.map((film) => Array.from(film.genres))
  .flat()
  .reduce((accumulator, genre) => {
    genresRating[genre] = (genresRating[genre] || 0) + 1;
  }, 0);

  for (let genre in genresRating) {
    ratings.push({genre, count: genresRating[genre]});
  }

  return ratings.sort((a, b) => b.count - a.count);
};

export const getTopGenreFilm = (films) => {
  if (films.length > 0) {
    return getSortCountFilmGenres(films)[0].genre;
  } else {
    return `–`;
  }
};
