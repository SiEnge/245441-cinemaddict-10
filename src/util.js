import moment from 'moment';
import {FilterType, ONE_HOUR_IN_MINUTE, TEN_MINUTES} from './const.js';

// import {ONE_HOUR_IN_MINUTE, TEN_MINUTES} from '../const.js';

// перенести в константы
// const ONE_HOUR_IN_MINUTE = 60;
// const TEN_MINUTES = 10;


export const formatDate = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};

export const formatDateYear = (date) => {
  return moment(date).format(`YYYY`);
};
// 30 March 1945

export const formatDateComment = (date) => {
  return moment(date).format(`YYYY/MM/DD HH:MM`);
};
// YYYY/MM/DD HH:MM. Например: 2019/12/31 23:59.
// перевод длительности
export const parseDuration = (duration) => {
  if (duration > ONE_HOUR_IN_MINUTE) {
    const hour = Math.floor(duration / ONE_HOUR_IN_MINUTE);
    const minute = (duration % ONE_HOUR_IN_MINUTE < TEN_MINUTES) ? `0${duration % ONE_HOUR_IN_MINUTE}` : duration % ONE_HOUR_IN_MINUTE;
    return `${hour}h ${minute}m`;
  } else {
    return `${duration}m`;
  }
};
  // const duration = getRandomIntegerNumber(DURATION_MIN, DURATION_MAX);


// экспорт констант места вставки
export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

// разобраться?? не работает
export const getRandomIntegerNumber = (min, max) => {
  // return min + Math.floor(max * Math.random());
  return min + Math.floor((max - min) * Math.random());
};

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);
  return array[randomIndex];
};

// создание dom элемента (отказ от вставки чисто разметки в верстку)
export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};


// вставка элемент в контейнер (отказ от insertAjast)
export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

// функция замены компонентов
export const replace = (newComponent, oldComponent) => {
  const parentElement = oldComponent.getElement().parentElement;
  const newElement = newComponent.getElement();
  const oldElement = oldComponent.getElement();

  const isExistElements = !!(parentElement && newElement && oldElement);

  if (isExistElements && parentElement.contains(oldElement)) {
    parentElement.replaceChild(newElement, oldElement);
  }
};



// функция для удаления элемента
export const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};

// получение звания пользователя
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

// фильтры (перенести в отдельный утиль)


const getWatchlistFilms = (films) => {
  return films.filter((film) => film.isWatchlist);
};

const getHistoryFilms = (films) => {
  return films.filter((film) => film.isWatched);
};

const getFavoritesFilms = (films) => {
  return films.filter((film) => film.isFavorite);
};


// получить список отфильтрованных фильмов
export const getFilmsByFilter = (films, filterType) => {
  let filteredFilms;
  // debugger;
  switch (filterType) {
    case FilterType.ALL:
      filteredFilms = films;
      break;
    case FilterType.WATCHLIST:
      filteredFilms = getWatchlistFilms(films);
      break;
    case FilterType.HISTORY:
      filteredFilms = getHistoryFilms(films);
      break;
    case FilterType.FAVORITES:
      filteredFilms = getFavoritesFilms(films);
      break;
  }
  return filteredFilms;
};
