import moment from 'moment';
import {UserProfile, MINUTE_IN_ONE_HOUR, TEN_MINUTES} from '../const.js';

export const formatDate = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};

export const formatDateYear = (date) => {
  return moment(date).format(`YYYY`);
};

export const formatDateComment = (date) => {
  return moment(date).format(`YYYY/MM/DD HH:MM`);
};

export const getTitleProfile = (countMovie) => {
  let titleProfile = ``;

  if (countMovie === 0) {
    titleProfile = ``;
  } else if (countMovie > 0 && countMovie <= 10) {
    titleProfile = UserProfile.NOVICE;
  } else if (countMovie > 10 && countMovie <= 20) {
    titleProfile = UserProfile.FAN;
  } else if (countMovie > 20) {
    titleProfile = UserProfile.MOVIE_BUFF;
  }
  return titleProfile;
};

export const getWatchedMovies = (allMovies) => {
  return allMovies.filter((movie) => movie.isWatched);
};

export const getTopRatedMovies = (allMovies) => {
  return allMovies
    .filter((movie) => movie.rating !== 0)
    .sort((a, b) => b.rating - a.rating);
};

export const getMostCommentedMovies = (allMovies) => {
  return allMovies
    .filter((movie) => movie.comments !== 0)
    .sort((a, b) => b.comments.length - a.comments.length);
};

export const getSortDownReleaseDateMovies = (allMovies) => {
  return allMovies.sort((a, b) => b.releaseDate - a.releaseDate);
};

export const parseDuration = (duration) => {
  if (duration > MINUTE_IN_ONE_HOUR) {
    const hour = Math.floor(duration / MINUTE_IN_ONE_HOUR);
    const minute = (duration % MINUTE_IN_ONE_HOUR < TEN_MINUTES) ? `0${duration % MINUTE_IN_ONE_HOUR}` : duration % MINUTE_IN_ONE_HOUR;
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

export const getRelativeTimeFromNow = (date) => {
  return moment(date).fromNow();
};

