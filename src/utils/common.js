import moment from 'moment';
import {ONE_HOUR_IN_MINUTE, TEN_MINUTES} from '../const.js';

export const formatDate = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};

export const formatDateYear = (date) => {
  return moment(date).format(`YYYY`);
};

export const formatDateComment = (date) => {
  return moment(date).format(`YYYY/MM/DD HH:MM`);
};

export const getTitleProfile = (countFilm) => {
  let titleProfile;

  if (countFilm === 0) {
    titleProfile = ``;
  }
  if (countFilm > 0 && countFilm <= 10) {
    titleProfile = `Novice`;
  }
  if (countFilm > 10 && countFilm <= 20) {
    titleProfile = `Fan`;
  }
  if (countFilm > 20) {
    titleProfile = `Movie Buff`;
  }
  return titleProfile;
};

export const getWatchedMovies = (allMovies) => {
  return allMovies.filter((movie) => movie.isWatched);
};

export const getTopRatedMovies = (allMovies) => {
  return allMovies.filter((film) => film.rating !== 0)
    .sort((a, b) => b.rating - a.rating);
};

export const getMostCommentedMovies = (allMovies) => {
  return allMovies.filter((film) => film.comments !== 0)
    .sort((a, b) => b.comments.length - a.comments.length);
};

export const getSortDownReleaseDateMovies = (allMovies) => {
  return allMovies.sort((a, b) => b.releaseDate - a.releaseDate);
};

export const parseDuration = (duration) => {
  if (duration > ONE_HOUR_IN_MINUTE) {
    const hour = Math.floor(duration / ONE_HOUR_IN_MINUTE);
    const minute = (duration % ONE_HOUR_IN_MINUTE < TEN_MINUTES) ? `0${duration % ONE_HOUR_IN_MINUTE}` : duration % ONE_HOUR_IN_MINUTE;
    return `${hour}h ${minute}m`;
  } else {
    return `${duration}m`;
  }
};

export const activateElement = (wrap, activeElement, activeClassName) => {
  const currentActiveElement = wrap.querySelector(`.${activeClassName}`);
  currentActiveElement.classList.remove(activeClassName);
  activeElement.classList.add(activeClassName);
};
